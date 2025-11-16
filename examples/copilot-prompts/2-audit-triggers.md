# Copilot Prompt: Audit Triggers

## Prompt

```
Create a PostgreSQL migration that defines a generic audit.if_modified_func() PL/pgSQL function producing per‑field diffs as JSONB and an audit_log table (immutable). Add triggers on INSERT/UPDATE/DELETE for all business tables. Include actorId, ip, userAgent via SET LOCAL fallback to null.
```

## What This Creates

This prompt generates a comprehensive database-level audit logging system with:

### Core Components

1. **Audit Context Function** (`get_audit_context()`)
   - Retrieves audit information from session variables
   - Fallbacks to safe defaults if not set
   - Returns: actorId, actorEmail, ip, userAgent

2. **Generic Trigger Function** (`audit_trigger_func()`)
   - Handles INSERT, UPDATE, and DELETE operations
   - Produces per-field diffs in JSONB format
   - Writes to AuditLog table automatically

3. **Audit Log Table**
   - Immutable record of all changes
   - JSONB storage for efficient diff queries
   - Transaction ID for grouping related changes

4. **Triggers on All Business Tables**
   - Job, Sample, TestAssignment
   - Client, Method, Specification, Section
   - TestDefinition, TestPack, Attachment
   - COAReport

### Audit Context Flow

```
Application Layer
    ↓ (sets session variables)
SET LOCAL app.actor_id = 'uuid'
SET LOCAL app.actor_email = 'user@example.com'
SET LOCAL app.ip = '192.168.1.1'
SET LOCAL app.user_agent = 'Mozilla/5.0...'
    ↓
Database Trigger
    ↓ (reads via get_audit_context())
AuditLog Table
```

### JSONB Change Format

**INSERT:**
```json
{
  "new": {
    "id": "uuid",
    "sampleCode": "SAMPLE-001",
    "status": "DRAFT",
    ...
  }
}
```

**UPDATE:**
```json
{
  "old": {
    "status": "DRAFT",
    "result": null
  },
  "new": {
    "status": "COMPLETED",
    "result": "50.5"
  }
}
```

**DELETE:**
```json
{
  "old": {
    "id": "uuid",
    "sampleCode": "SAMPLE-001",
    ...
  }
}
```

## Implementation Steps

### 1. Create Migration File

```bash
npx prisma migrate create add_audit_triggers
```

### 2. Add SQL Functions

The migration includes:
- `get_audit_context()` function
- `audit_trigger_func()` generic trigger
- Triggers for all tables

### 3. Application Integration

In your NestJS application:

```typescript
// Middleware to set audit context
export class AuditContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user; // From auth middleware
    
    if (user) {
      // Set session variables for database triggers
      const queries = [
        `SET LOCAL app.actor_id = '${user.id}'`,
        `SET LOCAL app.actor_email = '${user.email}'`,
        `SET LOCAL app.ip = '${req.ip}'`,
        `SET LOCAL app.user_agent = '${req.get('user-agent')}'`,
      ];
      
      // Execute before any database operations
      await prisma.$executeRawUnsafe(queries.join('; '));
    }
    
    next();
  }
}
```

## Features

### Automatic Logging
- **Zero Code Changes**: Triggers work automatically on all DML operations
- **Backstop Protection**: Even direct SQL bypasses cannot skip audit logging
- **Transaction Aware**: Groups related changes by transaction ID

### Immutability
- Audit logs cannot be updated or deleted
- Add database constraints to enforce this:

```sql
-- Prevent updates to AuditLog
CREATE OR REPLACE RULE audit_log_no_update AS
  ON UPDATE TO "AuditLog"
  DO INSTEAD NOTHING;

-- Prevent deletes from AuditLog
CREATE OR REPLACE RULE audit_log_no_delete AS
  ON DELETE TO "AuditLog"
  DO INSTEAD NOTHING;
```

### Performance Optimization
- Only logs actual changes (not no-op updates)
- Indexes on common query fields
- JSONB for efficient storage and queries

### Querying Audit Logs

```typescript
// Find all changes to a specific record
const auditLog = await prisma.auditLog.findMany({
  where: {
    table: 'Sample',
    recordId: sampleId,
  },
  orderBy: { at: 'asc' },
});

// Find who changed a field
const changes = await prisma.$queryRaw`
  SELECT 
    "actorEmail",
    "at",
    "changes"->'new'->>'status' as new_status,
    "changes"->'old'->>'status' as old_status
  FROM "AuditLog"
  WHERE "table" = 'Sample'
    AND "recordId" = ${sampleId}
    AND "changes"->'new' ? 'status'
  ORDER BY "at" DESC
`;

// Find all changes in a transaction
const txChanges = await prisma.auditLog.findMany({
  where: { txId: transactionId },
  orderBy: { at: 'asc' },
});
```

## Implementation Reference

See the actual implementation in:
- `packages/api/prisma/migrations/20251114063500_add_audit_triggers/migration.sql`
- `packages/api/prisma/migrations/20251114100000_audit_log_immutability/migration.sql`
- `packages/api/src/audit/audit-context.middleware.ts`

## Follow-Up Prompts

After implementing audit triggers, you might want to:

1. **Add Audit Viewer UI:**
   ```
   Copilot, create a React component AuditLogViewer that:
   - Shows timeline of changes to a record
   - Displays before/after values
   - Shows who made each change with timestamp
   - Filters by date range and actor
   - Highlights changed fields
   ```

2. **Add Audit Report:**
   ```
   Copilot, create an API endpoint GET /audit/report that generates
   a compliance report showing all changes in a date range, grouped
   by table and actor, with export to CSV.
   ```

3. **Add Change Notifications:**
   ```
   Copilot, create a service that monitors AuditLog for critical changes
   (e.g., result modifications, status changes to RELEASED) and sends
   notifications to relevant stakeholders.
   ```

## Compliance Benefits

### FDA 21 CFR Part 11
- ✅ Complete audit trail
- ✅ Cannot alter records without detection
- ✅ Time-stamped activity records
- ✅ User identification

### ISO 17025
- ✅ Traceability of measurements
- ✅ Document control
- ✅ Recording of observations
- ✅ Archive integrity

### GxP (Good Practice)
- ✅ Data integrity (ALCOA+)
- ✅ Audit trail review
- ✅ Change control
- ✅ Accountability

## Testing

Test the audit system:

```typescript
describe('Audit Triggers', () => {
  it('logs INSERT operations', async () => {
    const sample = await prisma.sample.create({
      data: { /* ... */ },
    });
    
    const audit = await prisma.auditLog.findFirst({
      where: {
        table: 'Sample',
        recordId: sample.id,
        action: 'CREATE',
      },
    });
    
    expect(audit).toBeDefined();
    expect(audit.changes.new).toMatchObject({ id: sample.id });
  });
  
  it('logs UPDATE operations with diffs', async () => {
    const sample = await prisma.sample.update({
      where: { id: sampleId },
      data: { status: 'COMPLETED' },
    });
    
    const audit = await prisma.auditLog.findFirst({
      where: {
        table: 'Sample',
        recordId: sample.id,
        action: 'UPDATE',
      },
      orderBy: { at: 'desc' },
    });
    
    expect(audit.changes.old.status).toBe('DRAFT');
    expect(audit.changes.new.status).toBe('COMPLETED');
  });
  
  it('logs DELETE operations', async () => {
    await prisma.sample.delete({
      where: { id: sampleId },
    });
    
    const audit = await prisma.auditLog.findFirst({
      where: {
        table: 'Sample',
        recordId: sampleId,
        action: 'DELETE',
      },
    });
    
    expect(audit).toBeDefined();
    expect(audit.changes.old.id).toBe(sampleId);
  });
});
```

## Troubleshooting

### Audit Context Not Set
If `actorId` shows as `00000000-0000-0000-0000-000000000000`:
- Check that middleware is registered globally
- Verify session variables are set before database operations
- Ensure user is authenticated

### Performance Issues
If audit logging is slow:
- Add indexes to AuditLog (table, recordId, at, actorId)
- Consider partitioning AuditLog by date
- Archive old audit logs to separate table

### Missing Audit Entries
- Verify triggers are installed: `\dS audit_*` in psql
- Check trigger execution: `SELECT * FROM pg_trigger`
- Ensure transaction is committed

## Best Practices

1. **Set Context Early**: Use middleware to set audit context at request start
2. **Transaction Grouping**: Use `txId` to group related changes
3. **Regular Review**: Set up automated reviews of audit logs
4. **Archival Strategy**: Plan for long-term storage (7+ years for FDA)
5. **Access Control**: Limit who can read audit logs (ADMIN, LAB_MANAGER)
6. **Monitoring**: Alert on suspicious patterns (bulk deletes, off-hours changes)
