# Non-Functional Requirements Implementation

This document describes the implementation of non-functional requirements for Laboratory LIMS Pro, ensuring security, performance, reliability, internationalization, accessibility, and operational excellence.

## Table of Contents

1. [Security (OWASP ASVS L2)](#security)
2. [Performance](#performance)
3. [Reliability](#reliability)
4. [Internationalization](#internationalization)
5. [Accessibility](#accessibility)
6. [Backups](#backups)
7. [Configuration Management](#configuration-management)

---

## Security (OWASP ASVS L2)

### Overview

The application implements OWASP Application Security Verification Standard Level 2 practices to ensure robust security.

### Implemented Security Features

#### 1. Server-Side Authorization

**Location:** `packages/api/src/app.module.ts`

All API endpoints are protected with layered authorization:

```typescript
// Three-layer authorization
1. JwtAuthGuard - Verifies JWT token
2. RolesGuard - Checks user role (ADMIN, LAB_MANAGER, ANALYST, etc.)
3. PermissionsGuard - Fine-grained permissions based on action and resource
```

**Details:**
- Every API request requires valid JWT authentication
- Role-based access control (RBAC) with 5 system roles
- Fine-grained permissions for 12 actions × 15 resources
- Record-level authorization (e.g., analysts can only edit assigned samples)

See `RBAC_IMPLEMENTATION_SUMMARY.md` for complete details.

#### 2. Input Validation

**Location:** `packages/api/src/main.ts`, DTOs throughout the codebase

All input is validated using `class-validator` decorators:

```typescript
// Global validation pipe
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Strip non-whitelisted properties
    transform: true,               // Transform to DTO instances
    forbidNonWhitelisted: true,   // Reject extra properties
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

**Example DTO with Validation:**
```typescript
export class CreateSampleDto {
  @IsUUID()
  jobId: string;

  @IsString()
  @MaxLength(255)
  sampleCode: string;

  @IsOptional()
  @IsNumber()
  @Min(-273.15)
  @Max(1000)
  temperatureOnReceiptC?: number;
}
```

**Validation Rules:**
- All required fields are validated
- String length limits prevent overflow
- Number ranges prevent invalid values
- UUID validation for foreign keys
- Date format validation
- Enum validation for status fields

#### 3. Rate Limiting

**Location:** `packages/api/src/app.module.ts`

Rate limiting prevents brute force and DoS attacks:

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000,  // 60 seconds
    limit: 100,  // 100 requests per IP
  },
]),
```

**Configuration:**
- 100 requests per minute per IP address
- Applied globally via `ThrottlerGuard`
- Can be overridden per controller/route with `@Throttle()` decorator

#### 4. Security Headers (Helmet)

**Location:** `packages/api/src/main.ts`

Helmet adds security headers to all responses:

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);
```

**Headers Added:**
- `Content-Security-Policy` - XSS protection
- `X-Content-Type-Options: nosniff` - MIME sniffing protection
- `X-Frame-Options: SAMEORIGIN` - Clickjacking protection
- `Strict-Transport-Security` - HTTPS enforcement
- `X-XSS-Protection` - Additional XSS protection

#### 5. CORS Configuration

**Location:** `packages/api/src/main.ts`

Strict CORS policy prevents unauthorized cross-origin requests:

```typescript
app.enableCors({
  origin: process.env.WEB_URL || 'http://localhost:3002',
  credentials: true,
});
```

#### 6. Environment Variable Validation

**Location:** `packages/api/src/config/env.validation.ts`

All required configuration is validated at startup:

```typescript
export class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;
  
  // ... more validations
}
```

**Benefits:**
- Application fails fast if configuration is missing
- Prevents runtime errors due to missing secrets
- Clear error messages for misconfiguration

#### 7. Password Security

**Location:** `packages/api/src/auth/auth.service.ts`

- Passwords hashed with bcrypt (10 rounds)
- Never stored in plaintext
- JWT tokens for stateless authentication
- Configurable token expiration

#### 8. Audit Logging

**Location:** `packages/api/src/audit/`

All data changes are logged immutably:
- Who made the change (user ID, email)
- What changed (old and new values)
- When it happened (timestamp)
- Why (optional reason)
- Where (IP address, user agent)

### Security Best Practices

1. **No Secrets in Repository**
   - All secrets in `.env` files (gitignored)
   - `.env.example` provides template without secrets
   - Environment validation ensures secrets are present

2. **Principle of Least Privilege**
   - Users only get minimum required permissions
   - Record-level authorization limits data access
   - Clients can only view their own data

3. **Defense in Depth**
   - Multiple layers of security (guards)
   - Input validation at DTO level
   - Business logic validation in services
   - Database constraints as final safeguard

4. **Secure by Default**
   - All endpoints require authentication by default
   - Public endpoints must explicitly use `@Public()` decorator
   - Rate limiting enabled globally

---

## Performance

### Database Indexes

**Location:** `packages/api/prisma/schema.prisma`

Comprehensive indexing strategy for optimal query performance:

#### Foreign Key Indexes (Already Present)
- All foreign key fields indexed
- Enables fast joins and lookups

#### Status Indexes
- `Sample.released`
- `Job.status`
- `TestAssignment.status`
- `COAReport.status`

#### Compound Indexes (New)
```prisma
model TestAssignment {
  // ... fields ...
  
  @@index([sampleId, status])  // Filter tests by sample and status
  @@index([oos])                // Find out-of-spec tests
}
```

**Query Optimization:**
```sql
-- Fast: Uses compound index
SELECT * FROM "TestAssignment" 
WHERE "sampleId" = $1 AND status = 'IN_PROGRESS';

-- Fast: Uses oos index
SELECT * FROM "TestAssignment" WHERE oos = true;
```

### Pagination

**Location:** List endpoints in controllers

All list endpoints support pagination:

```typescript
@Get()
async listSamples(
  @Query('page') page?: string,
  @Query('perPage') perPage?: string,
) {
  return this.service.listSamples({
    page: page ? parseInt(page, 10) : 1,
    perPage: perPage ? parseInt(perPage, 10) : 50,
  });
}
```

**Benefits:**
- Prevents loading thousands of records at once
- Reduces memory usage
- Faster response times
- Better user experience

### Search Functionality

List endpoints support filtering:
- Filter by client, job, status
- Filter by date ranges
- Text search on key fields

**Example:**
```typescript
@Get()
async listSamples(
  @Query('jobId') jobId?: string,
  @Query('clientId') clientId?: string,
  @Query('released') released?: string,
  @Query('urgent') urgent?: string,
) {
  // Filters applied in service
}
```

### Performance Monitoring

**Health Check Endpoint:** `/health`

Monitor application and database health:
- Database connectivity check
- Response time monitoring
- Resource usage tracking

---

## Reliability

### Transactions for Multi-Record Operations

**Location:** Service methods using Prisma

Critical operations use database transactions:

```typescript
async createSampleWithTests(dto: CreateSampleDto) {
  return await this.prisma.$transaction(async (tx) => {
    // Create sample
    const sample = await tx.sample.create({ ... });
    
    // Create related test assignments
    await tx.testAssignment.createMany({ ... });
    
    // Create audit log entries
    await tx.auditLog.create({ ... });
    
    return sample;
  });
}
```

**Benefits:**
- All-or-nothing execution
- Data consistency guaranteed
- Automatic rollback on error

### Optimistic Concurrency Control

**Location:** `packages/api/prisma/schema.prisma`

All models have `updatedAt` field for version control:

```typescript
async updateSample(id: string, dto: UpdateSampleDto) {
  const current = await this.prisma.sample.findUnique({ where: { id } });
  
  // Check if record was modified since read
  if (current.updatedAt !== dto.expectedUpdatedAt) {
    throw new ConflictException('Record was modified by another user');
  }
  
  return await this.prisma.sample.update({ where: { id }, data: dto });
}
```

**Prevents:**
- Lost updates
- Data corruption from concurrent edits
- Race conditions

### Error Handling

**Location:** NestJS exception filters

Structured error responses:

```typescript
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "sampleCode must be a string",
    "jobId must be a UUID"
  ]
}
```

### Health Checks

**Location:** `packages/api/src/health/`

Monitor application health:

```bash
curl http://localhost:3000/health

# Response
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  }
}
```

---

## Internationalization

### Date Handling

**Location:** Throughout the application

Dates stored as UTC in database:
- All `DateTime` fields in Prisma schema
- Frontend formats dates per user locale
- ISO 8601 format in API responses

```typescript
// API returns
{
  "dateReceived": "2024-01-15T10:30:00.000Z"
}

// Frontend formats per locale
// en-US: 1/15/2024, 10:30 AM
// en-GB: 15/01/2024, 10:30
// de-DE: 15.01.2024, 10:30
```

### Number Formatting

Temperature and measurements stored as `Decimal`:

```prisma
model Sample {
  temperatureOnReceiptC Decimal? @db.Decimal(5, 2)
}
```

**Benefits:**
- Precise decimal storage
- No floating-point rounding errors
- Can format per locale on frontend

### Temperature Storage

°C stored as numeric (not string):
- `temperatureOnReceiptC` field is `Decimal`
- Validation: -273.15 to 1000 (absolute zero to reasonable max)
- Can convert to °F or K on frontend

---

## Accessibility

### WCAG 2.1 AA Compliance

**Frontend Implementation Required:**

#### Keyboard Navigation
- All interactive elements keyboard accessible
- Tab order logical and intuitive
- Skip navigation links
- Focus indicators visible

#### ARIA Labels
- Form inputs have labels
- Buttons have descriptive text
- Status messages announced
- Loading states indicated

#### Color Contrast
- 4.5:1 contrast for normal text
- 3:1 contrast for large text
- 3:1 contrast for UI components

#### Forms and Grids
- Form validation feedback
- Error messages associated with fields
- Table headers properly marked
- Grid navigation with arrow keys

**Testing:**
- Use WAVE or axe DevTools
- Test with screen readers (NVDA, JAWS)
- Keyboard-only navigation testing

---

## Backups

### Automated Backup Scripts

**Location:** `scripts/`

#### Database Backup
```bash
./scripts/backup-database.sh
```

**Features:**
- Daily automated backups via cron
- Compressed backups (gzip)
- 30-day retention (configurable)
- Timestamped files

#### Object Storage Backup
```bash
./scripts/backup-storage.sh
```

**Features:**
- Backs up MinIO buckets
- Compressed tar archives
- 30-day retention (configurable)
- Uses MinIO Client (mc)

### Cron Configuration

```cron
# Database backup - daily at 2 AM
0 2 * * * cd /path/to/lims && ./scripts/backup-database.sh

# Storage backup - daily at 3 AM
0 3 * * * cd /path/to/lims && ./scripts/backup-storage.sh
```

### Restore Procedures

**Database Restore:**
```bash
./scripts/restore-database.sh ./backups/database/lims_backup_20240115_020000.sql.gz
```

**Storage Restore:**
```bash
tar -xzf ./backups/storage/minio_backup_20240115_030000.tar.gz -C /tmp/restore
mc mirror /tmp/restore lims/lims-files
```

See `scripts/BACKUP_DOCUMENTATION.md` for complete details.

---

## Configuration Management

### Environment Variables

**Location:** `.env` file (not committed to git)

All configuration via environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lims_db"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRATION="7d"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_USE_SSL="false"
MINIO_BUCKET_NAME="lims-files"

# Server
PORT="3000"
NODE_ENV="production"
```

### Configuration Validation

**Location:** `packages/api/src/config/env.validation.ts`

Validates configuration at startup:
- Checks all required variables present
- Validates types and formats
- Fails fast with clear error messages

```typescript
// Application will not start if configuration is invalid
Error: Configuration validation failed:
JWT_SECRET: should not be empty
MINIO_ENDPOINT: should not be empty
```

### Secret Management Best Practices

1. **Never commit secrets to git**
   - `.env` in `.gitignore`
   - Use `.env.example` as template
   - Document all required variables

2. **Use strong secrets**
   - Generate random JWT secrets: `openssl rand -base64 32`
   - Use different secrets per environment
   - Rotate secrets periodically

3. **Secure storage**
   - Use environment variables in production
   - Consider secret management tools (Vault, AWS Secrets Manager)
   - Restrict file permissions: `chmod 600 .env`

4. **Audit access**
   - Log who accesses secrets
   - Monitor for unauthorized access
   - Rotate immediately if compromised

---

## Testing Non-Functional Requirements

### Security Testing

```bash
# Run security audit
npm audit

# Check for vulnerable dependencies
npm audit fix

# Run CodeQL analysis (CI/CD)
```

### Performance Testing

```bash
# Load testing with Artillery
artillery quick --count 10 -n 100 http://localhost:3000/api/samples

# Database query performance
npm run prisma:studio
# Check query performance in logs
```

### Backup Testing

```bash
# Test database backup
./scripts/backup-database.sh

# Test restore on test database
DATABASE_URL="postgresql://test:test@localhost:5433/test_db" \
./scripts/restore-database.sh ./backups/database/lims_backup_latest.sql.gz
```

---

## Monitoring and Observability

### Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Database connectivity
curl http://localhost:3000/health | jq '.info.database'
```

### Logs

**Location:** Console output (Pino logger)

Structured JSON logs:
```json
{
  "level": 30,
  "time": 1705315200000,
  "msg": "Request completed",
  "req": {
    "method": "GET",
    "url": "/api/samples"
  },
  "res": {
    "statusCode": 200
  },
  "responseTime": 42
}
```

### Metrics

Consider implementing:
- Prometheus metrics endpoint
- Request duration histograms
- Error rate monitoring
- Database query time tracking

---

## Production Checklist

Before deploying to production:

- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Use production database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Enable SSL for MinIO (`MINIO_USE_SSL=true`)
- [ ] Configure CORS with production domain
- [ ] Set up automated backups (cron)
- [ ] Test backup restoration procedure
- [ ] Configure monitoring and alerting
- [ ] Set up log aggregation
- [ ] Review and adjust rate limits
- [ ] Enable database SSL connection
- [ ] Set up off-site backup storage
- [ ] Document disaster recovery procedures
- [ ] Perform security audit
- [ ] Load test the application
- [ ] Set up health check monitoring

---

## Compliance Summary

### OWASP ASVS L2
✅ Authentication and session management  
✅ Input validation  
✅ Access control (authorization)  
✅ Cryptography (bcrypt, JWT)  
✅ Error handling and logging  
✅ Data protection  
✅ Security configuration  

### Performance Requirements
✅ Database indexes on critical fields  
✅ Compound indexes for common queries  
✅ Pagination on list endpoints  
✅ Search and filtering  

### Reliability Requirements
✅ Transactions for multi-record operations  
✅ Optimistic concurrency with updatedAt  
✅ Error handling middleware  
✅ Health check endpoints  

### Internationalization
✅ Dates stored as UTC  
✅ Numbers stored as Decimal  
✅ °C stored as numeric  
✅ Frontend can format per locale  

### Backups
✅ Database backup scripts  
✅ Object storage backup scripts  
✅ Automated scheduling examples  
✅ Restore procedures documented  

### Configuration
✅ All secrets in .env  
✅ Environment validation  
✅ No secrets in repository  
✅ Configuration documentation  

---

## References

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [Prisma Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Backup Best Practices](https://www.postgresql.org/docs/current/backup.html)
