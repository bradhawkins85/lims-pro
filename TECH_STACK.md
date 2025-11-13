# Laboratory LIMS Pro - Tech Stack Documentation

This document provides detailed information about the technology stack implemented for the Laboratory LIMS Pro system.

## Architecture Overview

Laboratory LIMS Pro follows a **modern monorepo architecture** with separate frontend and backend packages:

- **Monorepo Structure**: NPM workspaces for managing multiple packages
- **Frontend**: `packages/web` - Next.js 16 with App Router
- **Backend**: `packages/api` - NestJS REST API

## Frontend Stack

### Core Framework
- **Next.js 16.0.3**: React framework with App Router for modern server-side rendering
- **React 19**: Latest version with concurrent features
- **TypeScript 5.7**: Strong typing for better developer experience

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Modern CSS**: PostCSS with Tailwind

### Forms & Validation
- **React Hook Form 7.54**: Performant forms with easy validation
- **Zod 3.25**: TypeScript-first schema validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Data Fetching & State
- **TanStack Query 5.83** (React Query): Powerful data synchronization
- **TanStack Query DevTools**: Development tools for debugging queries

### Authentication
- **NextAuth.js 4.24**: Authentication for Next.js
- **JWT Sessions**: Secure token-based authentication
- **OAuth Support**: Optional OAuth providers (Google, GitHub, etc.)

### Development
- **ESLint 9**: Code linting
- **TypeScript**: Type checking
- **Turbopack**: Next.js's new bundler for faster builds

## Backend Stack

### Core Framework
- **NestJS 11**: Progressive Node.js framework built with TypeScript
- **Express**: Underlying HTTP server
- **TypeScript 5.7**: Full type safety

### API & Documentation
- **REST API**: Standard REST endpoints
- **Swagger/OpenAPI 8**: Automatic API documentation at `/api/docs`
- **Class Validator**: Request validation
- **Class Transformer**: Object transformation

### Authentication & Authorization
- **Passport.js**: Authentication middleware
- **JWT Strategy**: JSON Web Token authentication
- **passport-jwt 4.0**: JWT authentication strategy
- **bcrypt 5.1**: Password hashing
- **RBAC**: Role-based access control with guards and decorators

### Database
- **PostgreSQL 16**: Production-ready relational database
- **Prisma ORM 6.4**: Modern TypeScript ORM
  - UUID Primary Keys: Universally unique identifiers
  - JSONB Support: Flexible metadata and audit snapshots
  - Type Safety: Auto-generated TypeScript types
  - Migrations: Database schema versioning

#### Database Schema Highlights
```prisma
// UUID Primary Keys
id String @id @default(uuid()) @db.Uuid

// JSONB for flexible data
metadata Json?
snapshot Json?

// Enums for RBAC
enum Role {
  ADMIN
  MANAGER
  TECHNICIAN
  USER
}
```

### File Storage
- **MinIO 8.0**: S3-compatible object storage
  - Local development storage
  - Production-ready scaling
  - AWS S3 compatible API
  - File versioning support

### PDF Generation
- **Puppeteer 24.3**: Headless Chrome automation
- **HTML Templates**: Server-side rendering
- **PDF Export**: High-quality PDF generation
- **Browserless Chrome**: Dedicated Chrome service in Docker

### Logging & Monitoring
- **Pino 9.6**: High-performance JSON logger
  - Structured logging
  - Low overhead
  - JSON output for easy parsing
- **pino-http 11.0**: HTTP request logging
- **pino-pretty 13.0**: Pretty printing for development
- **nestjs-pino 4.2**: NestJS integration

### Testing
- **Jest 30**: JavaScript testing framework
  - Unit tests for services and controllers
  - Integration tests
  - Coverage reports
- **Supertest 7**: HTTP assertion library
- **ts-jest 29**: TypeScript support for Jest

## Testing Infrastructure

### Unit Testing (Jest)
```bash
npm run test              # Run all unit tests
npm run test:watch        # Watch mode
npm run test:cov          # Coverage report
```

### E2E Testing (Playwright)
- **Playwright 1.49**: Modern browser automation
  - Cross-browser testing (Chrome, Firefox, Safari)
  - Parallel test execution
  - Screenshot and video recording
  - Network interception

```bash
npm run test:e2e          # Run e2e tests
```

## Containerization

### Docker Compose Services

#### 1. **PostgreSQL** (postgres:16-alpine)
- Port: 5432
- Database: lims_db
- Health checks enabled
- Persistent volume: `postgres_data`

#### 2. **MinIO** (minio/minio:latest)
- API Port: 9000
- Console Port: 9001
- Default credentials: minioadmin/minioadmin
- Persistent volume: `minio_data`

#### 3. **Browserless Chrome** (browserless/chrome:latest)
- Port: 3001
- Shared memory: 2GB
- Concurrent sessions: 10
- Connection timeout: 60s

#### 4. **API Service** (NestJS)
- Port: 3000
- Health check: GET /
- API docs: GET /api/docs
- Hot reload in development

#### 5. **Web Service** (Next.js)
- Port: 3002
- Server-side rendering
- Hot reload in development
- Static optimization

### Docker Commands
```bash
npm run docker:up         # Start all services
npm run docker:down       # Stop all services
docker-compose logs -f    # View logs
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### Lint Job
- Runs ESLint on all packages
- Parallel execution for web and api
- Fails on any linting errors

#### Type Check Job
- TypeScript compilation check
- Generates Prisma Client for API
- No emit, just type checking

#### Test Job
- Runs Jest unit tests
- PostgreSQL service container
- Test database setup
- Coverage reports

#### Build Job
- Builds both packages
- Uploads build artifacts
- Validates production builds
- Dependency on lint and test jobs

#### Docker Job
- Builds Docker images
- Publishes to GitHub Container Registry
- Multi-platform support
- Cache optimization
- Only on main branch

### Workflow Triggers
- Push to main/develop branches
- Pull requests to main/develop
- Manual workflow dispatch

## Database Migrations

### Prisma Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate --workspace=api

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npm run prisma:studio --workspace=api

# Seed database
npm run prisma:seed --workspace=api
```

### Migration Best Practices
1. Always generate Prisma Client after schema changes
2. Test migrations in development first
3. Use descriptive migration names
4. Review generated SQL before applying

## Environment Configuration

### API Environment Variables
```bash
DATABASE_URL              # PostgreSQL connection string
JWT_SECRET                # Secret for JWT signing
JWT_EXPIRATION           # Token expiration (e.g., "7d")
MINIO_ENDPOINT           # MinIO server address
MINIO_PORT               # MinIO port
MINIO_ACCESS_KEY         # MinIO access key
MINIO_SECRET_KEY         # MinIO secret key
CHROME_WS_ENDPOINT       # Puppeteer WebSocket endpoint
PORT                     # API server port
NODE_ENV                 # Environment (development/production)
```

### Web Environment Variables
```bash
NEXT_PUBLIC_API_URL      # API base URL
NEXTAUTH_URL             # NextAuth callback URL
NEXTAUTH_SECRET          # NextAuth encryption secret
NODE_ENV                 # Environment (development/production)
```

## Security Features

### Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Token expiration and refresh
- CSRF protection (NextAuth)

### Authorization
- Role-based access control (RBAC)
- Route guards
- Decorator-based permissions
- Fine-grained access control

### Data Protection
- UUID primary keys (no sequential IDs)
- SQL injection prevention (Prisma)
- XSS protection (React/Next.js)
- CORS configuration
- Environment variable protection

## Performance Optimizations

### Frontend
- Static page generation
- Incremental Static Regeneration
- Image optimization (Next.js)
- Code splitting
- Tree shaking
- Turbopack for faster builds

### Backend
- Database query optimization
- Connection pooling (Prisma)
- Response caching strategies
- Efficient logging (Pino)
- Gzip compression

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start Docker services
npm run docker:up

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed --workspace=api

# Start development servers
npm run dev
```

### Code Quality
```bash
# Lint all packages
npm run lint

# Format code (API)
npm run format --workspace=api

# Type check
cd packages/web && npx tsc --noEmit
cd packages/api && npx tsc --noEmit
```

## Deployment

### Production Build
```bash
# Build all packages
npm run build

# Build individually
npm run build:web
npm run build:api
```

### Docker Production Deploy
```bash
# Build and push images
docker-compose build
docker-compose push

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## Monitoring & Debugging

### Logs
- Structured JSON logs in production
- Pretty-printed logs in development
- Request/response logging
- Error tracking

### Health Checks
- API health: GET http://localhost:3000
- Database health: Prisma connection
- MinIO health: S3 API check
- Chrome health: WebSocket connection

### Development Tools
- Prisma Studio: Database GUI
- Swagger UI: API documentation
- TanStack Query DevTools: React Query debugging
- React DevTools: Component inspection

## Future Enhancements

### Planned Features
- [ ] Redis for caching and sessions
- [ ] Message queue (Bull/RabbitMQ)
- [ ] Real-time updates (WebSockets)
- [ ] Elasticsearch for full-text search
- [ ] Grafana for metrics visualization
- [ ] Sentry for error tracking
- [ ] S3 for production file storage

### Scaling Considerations
- Horizontal scaling with load balancer
- Database read replicas
- CDN for static assets
- Container orchestration (Kubernetes)
- Microservices architecture

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [NextAuth.js Documentation](https://next-auth.js.org/)

### Community
- [Next.js GitHub](https://github.com/vercel/next.js)
- [NestJS GitHub](https://github.com/nestjs/nest)
- [Prisma GitHub](https://github.com/prisma/prisma)

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/bradhawkins85/laboratory-lims-pro).
