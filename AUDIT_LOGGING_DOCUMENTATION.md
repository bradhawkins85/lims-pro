# Audit Logging Implementation

## Overview

The Laboratory LIMS Pro system includes comprehensive audit logging to track all changes to business data. The audit system captures who made changes, what was changed, when it occurred, and from where (IP address, user agent).

## Architecture

The audit logging system uses a **defense-in-depth** approach with multiple layers:

### 1. Database Layer (PostgreSQL Triggers)
- **Automatic logging**: Database triggers automatically log all INSERT, UPDATE, and DELETE operations
- **Cannot be bypassed**: Changes are logged at the database level, independent of application code
- **Location**: See migration `20251114063500_add_audit_triggers`

### 2. Application Layer (Middleware)
- **Context capture**: Middleware extracts user context from JWT tokens and HTTP requests
- **Session variables**: Sets PostgreSQL session variables for database triggers to read
- **Location**: `packages/api/src/audit/audit-context.middleware.ts`

### 3. Immutability Layer (Database Roles & Triggers)
- **Role restrictions**: Application role (`lims_app_role`) can only INSERT and SELECT audit logs
- **Deletion prevention**: Database triggers block any UPDATE or DELETE on audit logs
- **Location**: See migration `20251114100000_audit_log_immutability`

## Database Schema

### AuditLog Table

```sql
CREATE TABLE "AuditLog" (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actorId     UUID NOT NULL,           -- User who performed the action
  actorEmail  TEXT NOT NULL,           -- Email for human readability
  ip          TEXT,                    -- Client IP address
  userAgent   TEXT,                    -- Browser/client user agent
  action      "AuditAction" NOT NULL,  -- CREATE, UPDATE, or DELETE
  table       TEXT NOT NULL,           -- Table/entity name
  recordId    UUID NOT NULL,           -- ID of the affected record
  changes     JSONB,                   -- Field-level changes (old/new values)
  reason      TEXT,                    -- Optional reason for change
  at          TIMESTAMP NOT NULL DEFAULT NOW(),
  txId        TEXT                     -- Transaction ID to group related changes
);
```

### Changes JSONB Structure

For **CREATE** operations:
```json
{
  "new": {
    "id": "uuid",
    "name": "Sample Name",
    "status": "ACTIVE",
    ...
  }
}
```

For **UPDATE** operations:
```json
{
  "old": {
    "id": "uuid",
    "name": "Old Name",
    "status": "DRAFT"
  },
  "new": {
    "id": "uuid",
    "name": "New Name",
    "status": "ACTIVE"
  }
}
```

For **DELETE** operations:
```json
{
  "old": {
    "id": "uuid",
    "name": "Deleted Name",
    "status": "ACTIVE"
  }
}
```

## How It Works

### Request Flow

1. **User Authentication**
   - User logs in and receives JWT token
   - Token contains user ID (sub) and email

2. **API Request**
   - User makes authenticated request to API
   - JWT guard validates token and attaches user to request

3. **Audit Context Middleware**
   - Extracts user info from JWT (actorId, actorEmail)
   - Extracts IP from `x-forwarded-for` header or socket
   - Extracts user agent from request headers
   - Sets PostgreSQL session variables:
     ```sql
     SET LOCAL app.actor_id = 'user-uuid';
     SET LOCAL app.actor_email = 'user@example.com';
     SET LOCAL app.ip = '192.168.1.1';
     SET LOCAL app.user_agent = 'Mozilla/5.0...';
     ```

4. **Business Logic**
   - Controller/service performs database operations
   - Prisma executes INSERT/UPDATE/DELETE

5. **Database Triggers**
   - PostgreSQL triggers fire automatically (AFTER INSERT/UPDATE/DELETE)
   - Triggers read session variables via `get_audit_context()`
   - Audit log entry created with full context

6. **Response**
   - Business operation completes
   - Audit log persisted immutably

## API Endpoints

### Get Audit Logs

**GET** `/audit`

Query audit logs with optional filters and pagination.

**Query Parameters:**
- `table` (string): Filter by table name (e.g., "Sample", "Job")
- `recordId` (UUID): Filter by specific record ID
- `actorId` (UUID): Filter by user who performed the action
- `action` (enum): Filter by action type (CREATE, UPDATE, DELETE)
- `fromDate` (ISO 8601): Start date for time range
- `toDate` (ISO 8601): End date for time range
- `txId` (string): Filter by transaction ID
- `page` (number): Page number (default: 1)
- `perPage` (number): Results per page (default: 50, max: 100)
- `groupByTxId` (boolean): Group results by transaction ID (default: false)

**Response (normal):**
```json
{
  "logs": [
    {
      "id": "audit-uuid",
      "actorId": "user-uuid",
      "actorEmail": "user@example.com",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "action": "UPDATE",
      "table": "Sample",
      "recordId": "sample-uuid",
      "changes": {
        "old": { "status": "DRAFT" },
        "new": { "status": "ACTIVE" }
      },
      "reason": null,
      "at": "2025-11-14T10:30:00Z",
      "txId": "tx-1234567890-abc123"
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 50,
  "totalPages": 1,
  "grouped": false
}
```

**Response (grouped by txId):**
```json
{
  "logs": [
    {
      "txId": "tx-1234567890-abc123",
      "timestamp": "2025-11-14T10:30:00Z",
      "actorId": "user-uuid",
      "actorEmail": "user@example.com",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "logs": [
        {
          "id": "audit-uuid-1",
          "action": "CREATE",
          "table": "Job",
          "recordId": "job-uuid",
          "changes": {...},
          "reason": null
        },
        {
          "id": "audit-uuid-2",
          "action": "CREATE",
          "table": "Sample",
          "recordId": "sample-uuid",
          "changes": {...},
          "reason": null
        }
      ]
    }
  ],
  "total": 2,
  "page": 1,
  "perPage": 50,
  "totalPages": 1,
  "grouped": true
}
```

**Access Control:**
- Requires authentication
- Only accessible to ADMIN and LAB_MANAGER roles

### Get Audit Log by ID

**GET** `/audit/:id`

Retrieve a specific audit log entry by ID.

**Response:**
```json
{
  "id": "audit-uuid",
  "actorId": "user-uuid",
  "actorEmail": "user@example.com",
  "action": "UPDATE",
  "table": "Sample",
  "recordId": "sample-uuid",
  "changes": {...},
  "at": "2025-11-14T10:30:00Z",
  "txId": "tx-1234567890-abc123"
}
```

## Usage Examples

### View All Changes to a Specific Record

```bash
GET /audit?recordId=sample-uuid-123&page=1&perPage=20
```

### View All Changes by a Specific User

```bash
GET /audit?actorId=user-uuid-456&page=1&perPage=20
```

### View All Changes in a Date Range

```bash
GET /audit?fromDate=2025-11-01T00:00:00Z&toDate=2025-11-14T23:59:59Z
```

### View Grouped Transaction Changes

```bash
GET /audit?groupByTxId=true&page=1&perPage=20
```

### View All Deletions

```bash
GET /audit?action=DELETE&page=1&perPage=20
```

### View All Changes to Sample Table

```bash
GET /audit?table=Sample&page=1&perPage=20
```

## Security Features

### Immutability

The audit log is **immutable** - once a record is created, it cannot be modified or deleted. This is enforced through:

1. **Database Role Permissions**
   - Application role can only INSERT and SELECT
   - No UPDATE or DELETE privileges granted

2. **Database Triggers**
   - BEFORE UPDATE trigger raises exception
   - BEFORE DELETE trigger raises exception

3. **Application Logic**
   - AuditService only provides read and create methods
   - No update or delete methods exposed

### Access Control

- All audit endpoints require authentication
- Only ADMIN and LAB_MANAGER roles can view audit logs
- Regular users cannot access audit data (even for their own actions)

### Data Protection

- Session variables use PostgreSQL's transaction-scoped `SET LOCAL`
- Variables are automatically cleared after transaction completes
- No persistent session state that could leak between requests

## Monitored Tables

The following business tables have audit triggers enabled:

- **Jobs** (`Job`)
- **Samples** (`Sample`)
- **Test Assignments** (`TestAssignment`)
- **COA Reports** (`COAReport`)
- **Clients** (`Client`)
- **Methods** (`Method`)
- **Specifications** (`Specification`)
- **Sections** (`Section`)
- **Test Definitions** (`TestDefinition`)
- **Test Packs** (`TestPack`)
- **Attachments** (`Attachment`)

## Transaction Grouping

### What is a Transaction ID (txId)?

A transaction ID groups multiple audit log entries that occurred as part of a single business operation. For example:

- Creating a Job and multiple Samples in one API call
- Updating a Sample and its related TestAssignments together
- Bulk operations that affect multiple records

### Generating Transaction IDs

Transaction IDs can be generated in the application:

```typescript
const txId = auditService.generateTxId();
// Returns: "tx-1234567890-abc123"

// Use this txId when logging related operations
await auditService.logCreate(
  { ...context, txId },
  'Job',
  jobId,
  jobData
);

await auditService.logCreate(
  { ...context, txId },
  'Sample',
  sampleId,
  sampleData
);
```

### Viewing Grouped Transactions

Use the `groupByTxId=true` parameter to see related changes grouped together:

```bash
GET /audit?groupByTxId=true&fromDate=2025-11-14T00:00:00Z
```

This is useful for:
- Understanding the full scope of a business operation
- Debugging complex transactions
- Audit trail reporting
- Compliance investigations

## Compliance & Best Practices

### Regulatory Compliance

The audit system supports compliance with:

- **FDA 21 CFR Part 11**: Electronic records and signatures
- **ISO 17025**: Laboratory management systems
- **GxP**: Good laboratory practices
- **GDPR**: Data protection (audit who accessed what)

### Best Practices

1. **Never disable audit logging** in production
2. **Regular backups** of audit log table
3. **Monitor audit log growth** and archive old data if needed
4. **Review audit logs** regularly for suspicious activity
5. **Include audit logs** in disaster recovery plans

### Data Retention

Consider your organization's data retention policy:

- Legal requirements for audit trail retention
- Storage capacity planning
- Archive vs. delete strategies
- Compliance with data protection regulations

## Troubleshooting

### Audit logs not being created

1. **Check middleware is registered:**
   - Verify `AuditContextMiddleware` is applied in `AppModule`

2. **Check database triggers exist:**
   ```sql
   SELECT trigger_name, event_manipulation, event_object_table
   FROM information_schema.triggers
   WHERE trigger_name LIKE 'audit_%';
   ```

3. **Check session variables are set:**
   ```sql
   SELECT current_setting('app.actor_id', true);
   SELECT current_setting('app.actor_email', true);
   ```

4. **Check user is authenticated:**
   - Audit context requires valid JWT token
   - Public endpoints won't have audit context

### Missing actor information in logs

- Verify JWT token contains `sub` (user ID) and `email` claims
- Check Passport JWT strategy configuration
- Ensure middleware runs after JWT authentication

### Performance concerns

The audit system is designed for minimal performance impact:

- Database triggers are efficient (nanoseconds per operation)
- JSONB storage is optimized in PostgreSQL
- Indexes on key columns (actorId, table, recordId, at, txId)
- Pagination prevents large result sets

If experiencing performance issues:

1. Add database indexes for common query patterns
2. Implement audit log archiving for old data
3. Use read replicas for audit queries
4. Consider partitioning by date range

## Development

### Running Tests

```bash
# Test audit context middleware
npm test -- audit-context.middleware.spec.ts

# Test audit service
npm test -- audit.service.spec.ts

# Test all audit components
npm test -- audit/
```

### Applying Migrations

```bash
# Apply all pending migrations
npm run prisma:migrate:deploy --workspace=api

# Or in development
npm run prisma:migrate --workspace=api
```

### Code Location

- **Middleware**: `packages/api/src/audit/audit-context.middleware.ts`
- **Service**: `packages/api/src/audit/audit.service.ts`
- **Controller**: `packages/api/src/audit/audit.controller.ts`
- **Module**: `packages/api/src/audit/audit.module.ts`
- **Migrations**: 
  - `packages/api/prisma/migrations/20251114063500_add_audit_triggers/`
  - `packages/api/prisma/migrations/20251114100000_audit_log_immutability/`
- **Schema**: `packages/api/prisma/schema.prisma`

## Future Enhancements

Potential improvements to consider:

- [ ] Audit log archiving/partitioning for old data
- [ ] Real-time audit notifications for critical changes
- [ ] Audit log export (CSV, JSON, PDF reports)
- [ ] Advanced analytics and visualization
- [ ] Integration with SIEM systems
- [ ] Automated anomaly detection
- [ ] Audit log digital signatures for enhanced integrity
- [ ] Role-based audit log filtering (users see only their domain)

## Support

For issues or questions about audit logging:

1. Check this documentation
2. Review the test files for usage examples
3. Check database trigger definitions in migrations
4. Open an issue on GitHub with:
   - Detailed description of the problem
   - Steps to reproduce
   - Expected vs. actual behavior
   - Relevant log excerpts
