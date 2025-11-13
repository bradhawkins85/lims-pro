# Quick Start Guide - Laboratory LIMS Pro

Get up and running with Laboratory LIMS Pro in minutes.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20 or higher ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/bradhawkins85/laboratory-lims-pro.git
cd laboratory-lims-pro
```

### 2. Install Dependencies
```bash
npm install
```

This will install dependencies for all packages (root, web, and api).

### 3. Set Up Environment Variables

#### API Environment
```bash
cp packages/api/.env.example packages/api/.env
```

Edit `packages/api/.env` if needed:
```env
DATABASE_URL="postgresql://lims:lims_password@localhost:5432/lims_db"
JWT_SECRET="your-secret-key-change-in-production"
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
```

#### Web Environment
```bash
cp packages/web/.env.example packages/web/.env
```

Edit `packages/web/.env` if needed:
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="your-nextauth-secret-change-in-production"
```

### 4. Start Docker Services
```bash
npm run docker:up
```

This starts:
- PostgreSQL database (port 5432)
- MinIO object storage (ports 9000, 9001)
- Browserless Chrome (port 3001)

Wait for services to be healthy (check with `docker-compose ps`).

### 5. Set Up Database

Generate Prisma Client:
```bash
npm run prisma:generate
```

Run database migrations:
```bash
npm run prisma:migrate
```

When prompted, name your migration (e.g., "initial_setup").

Seed the database with test data:
```bash
npm run prisma:seed --workspace=api
```

### 6. Start Development Servers

Start both frontend and backend:
```bash
npm run dev
```

Or start them individually:
```bash
# Terminal 1 - Frontend
npm run dev:web

# Terminal 2 - Backend  
npm run dev:api
```

## Access the Application

Once everything is running, you can access:

### Web Application
**URL**: http://localhost:3002

### API Server
**URL**: http://localhost:3000
**Health Check**: http://localhost:3000
**API Documentation**: http://localhost:3000/api/docs

### Database Tools
**Prisma Studio**: 
```bash
npm run prisma:studio --workspace=api
```
Then open http://localhost:5555

### MinIO Console
**URL**: http://localhost:9001
**Credentials**: minioadmin / minioadmin

## Default Test Users

The seed script creates these test users:

| Email | Password | Role | Access Level |
|-------|----------|------|--------------|
| admin@lims.local | admin123 | ADMIN | Full system access |
| manager@lims.local | manager123 | MANAGER | Lab management |
| tech@lims.local | tech123 | TECHNICIAN | Lab operations |

## Testing the API

### Health Check
```bash
curl http://localhost:3000
```

### Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lims.local",
    "password": "admin123"
  }'
```

The response will include an `access_token` that you can use for authenticated requests.

### Make Authenticated Request
```bash
curl http://localhost:3000/some-protected-route \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Common Commands

### Development
```bash
# Start both services
npm run dev

# Start web only
npm run dev:web

# Start API only
npm run dev:api

# Restart Docker services
npm run docker:down
npm run docker:up
```

### Database
```bash
# View database in Prisma Studio
npm run prisma:studio --workspace=api

# Create new migration
cd packages/api
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
cd packages/api
npx prisma migrate reset
```

### Building
```bash
# Build all packages
npm run build

# Build web only
npm run build:web

# Build API only
npm run build:api
```

### Testing
```bash
# Run all tests
npm test

# Run API tests only
npm test --workspace=api

# Run e2e tests
npm run test:e2e

# Run tests in watch mode
npm test -- --watch
```

### Linting
```bash
# Lint all packages
npm run lint

# Lint and fix
npm run lint -- --fix
```

## Troubleshooting

### Docker Issues

**Services won't start:**
```bash
# Check Docker is running
docker ps

# View service logs
docker-compose logs -f

# Restart services
npm run docker:down
npm run docker:up
```

**Port conflicts:**
- Check if ports 3000, 3001, 3002, 5432, 9000, or 9001 are in use
- Modify ports in `docker-compose.yml` if needed

### Database Issues

**Prisma Client not found:**
```bash
npm run prisma:generate
```

**Migration errors:**
```bash
# Reset and recreate database
cd packages/api
npx prisma migrate reset
npx prisma migrate dev
```

**Connection errors:**
- Ensure PostgreSQL container is running: `docker ps`
- Check DATABASE_URL in `packages/api/.env`

### Build Issues

**Frontend build fails:**
```bash
# Clear Next.js cache
cd packages/web
rm -rf .next
npm run build
```

**Backend build fails:**
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Check TypeScript errors
cd packages/api
npx tsc --noEmit
```

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port (Mac/Linux)
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different ports in environment files
```

## Next Steps

Now that you have the system running:

1. **Explore the API**: Visit http://localhost:3000/api/docs
2. **Try the seeded data**: Use Prisma Studio to view test data
3. **Test authentication**: Login with test users
4. **Read the docs**: Check out TECH_STACK.md for detailed information
5. **Start building**: Add your own features!

## Getting Help

- **Documentation**: See README.md and TECH_STACK.md
- **Issues**: Report bugs on [GitHub Issues](https://github.com/bradhawkins85/laboratory-lims-pro/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/bradhawkins85/laboratory-lims-pro/discussions)

## Stopping the Application

### Stop Development Servers
Press `Ctrl+C` in the terminal running `npm run dev`

### Stop Docker Services
```bash
npm run docker:down
```

### Clean Up Everything
```bash
# Stop containers and remove volumes
docker-compose down -v

# Remove node_modules
rm -rf node_modules packages/*/node_modules

# Remove build artifacts
rm -rf packages/web/.next packages/api/dist
```

## Ready to Deploy?

When you're ready to deploy to production:

1. Update environment variables with production values
2. Build Docker images: `docker-compose build`
3. Push to container registry
4. Deploy using your orchestration platform
5. Run migrations: `npx prisma migrate deploy`

For detailed deployment instructions, see the main README.md.
