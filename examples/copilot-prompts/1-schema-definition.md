# Copilot Prompt: Schema Definition

## Prompt

```
Copilot, in schema.prisma, define models for User, Role, UserRole, Client, Method, Specification, Section, TestDefinition, TestPack, TestPackItem, Job, Sample, TestAssignment, Attachment, COAReport, AuditLog. Use UUID ids, timestamps, FKs, and JSONB where specified in PRD §2. Add indexes for lookups and (sampleId,status). Generate migrations.
```

## What This Creates

This prompt generates a complete Prisma schema for a Laboratory Information Management System (LIMS) with:

### Core Features
- **UUID Primary Keys**: All entities use UUID for better distribution and security
- **Timestamp Tracking**: createdAt and updatedAt fields for all models
- **Audit Trail**: createdById and updatedById foreign keys to track who made changes
- **Flexible Data**: JSONB fields for metadata and snapshots
- **Performance**: Strategic indexes on frequently queried fields

### Models Generated

#### System Models
- **User**: Authentication and user management with role-based access
- **Role**: Enum (ADMIN, LAB_MANAGER, ANALYST, SALES_ACCOUNTING, CLIENT)
- **AuditLog**: Immutable audit trail with JSONB changes field

#### Master Data Models
- **Client**: Customer organizations with contact information
- **Method**: Testing methods/procedures with LOD/LOQ
- **Specification**: Acceptance criteria with min/max/target values
- **Section**: Lab departments/sections
- **TestDefinition**: Templates for test types
- **TestPack**: Bundles of tests sold together
- **TestPackItem**: Many-to-many relationship between packs and test definitions

#### Operational Models
- **Job**: Work orders/projects with financial tracking
- **Sample**: Physical samples received for testing
- **TestAssignment**: Specific tests performed on samples
- **Attachment**: File metadata for documents
- **COAReport**: Version-controlled certificates of analysis

### Key Relationships

```
Client ─┬─> Job ──> Sample ─┬─> TestAssignment ──> Attachment
        └──────────────────┘  └──> COAReport

TestDefinition ──> TestPackItem <── TestPack

Section ─┬─> TestDefinition ──> TestAssignment
Method ──┤
Specification ─┘
```

### Important Indexes

The schema includes strategic indexes for:
- Unique identifiers (jobNumber, sampleCode, code fields)
- Foreign keys (for join performance)
- Status fields (for filtering)
- Date fields (for range queries)
- Compound indexes: **(sampleId, status)** for performance
- OOS flag for quick filtering of out-of-specification results

### Migration Generation

After defining the schema, run:
```bash
npx prisma migrate dev --name initial_core_domain_model
```

This creates:
1. SQL migration file in `prisma/migrations/`
2. Updated Prisma Client types
3. Database tables with all constraints

## Implementation Reference

See the actual implementation in:
- `packages/api/prisma/schema.prisma`
- `packages/api/prisma/migrations/20251114000000_initial_core_domain_model/`

## Example Usage

After schema generation, you can:

```typescript
// Create a new sample
const sample = await prisma.sample.create({
  data: {
    sampleCode: 'SAMPLE-001',
    dateReceived: new Date(),
    jobId: job.id,
    clientId: client.id,
    createdById: userId,
    updatedById: userId,
  },
});

// Assign a test to the sample
const testAssignment = await prisma.testAssignment.create({
  data: {
    sampleId: sample.id,
    testDefinitionId: testDef.id,
    sectionId: section.id,
    methodId: method.id,
    specificationId: spec.id,
    status: 'DRAFT',
    createdById: userId,
    updatedById: userId,
  },
});

// Record test result
await prisma.testAssignment.update({
  where: { id: testAssignment.id },
  data: {
    status: 'COMPLETED',
    testDate: new Date(),
    result: '50.5',
    resultUnit: 'ppm',
    oos: false,
    updatedById: userId,
  },
});
```

## Follow-Up Prompts

After generating the schema, you might want to:

1. **Add Seed Data:**
   ```
   Copilot, create a seed.ts file that populates the database with:
   - 5 test users (one for each role)
   - Sample master data (clients, methods, specifications, sections)
   - 1 sample job with test assignments
   ```

2. **Add Validation:**
   ```
   Copilot, create Zod schemas for each Prisma model to validate input data
   at the API layer. Follow NestJS patterns with DTOs.
   ```

3. **Generate TypeScript Types:**
   ```bash
   npx prisma generate
   ```
   This creates TypeScript types for all models.

## Compliance Notes

This schema supports regulatory compliance:
- **FDA 21 CFR Part 11**: Audit trail, versioning, electronic signatures
- **ISO 17025**: Test method tracking, equipment records, traceability
- **GxP**: Complete audit trail, immutable records, user accountability

## Best Practices Applied

1. **UUID over Auto-increment**: Better for distributed systems
2. **Soft Deletes**: Consider adding `deletedAt` field if needed
3. **Optimistic Concurrency**: Consider adding `version` field if needed
4. **Status Enums**: Use enums instead of strings for type safety
5. **JSONB for Flexibility**: Use for variable/evolving data structures
6. **Compound Indexes**: Add for common query patterns
7. **Foreign Key Constraints**: Maintain referential integrity
8. **Cascading Rules**: Careful with CASCADE vs RESTRICT

## Common Customizations

To extend this schema:

```
Copilot, add to the Prisma schema:
- Equipment model to track lab instruments with calibration dates
- Reagent model for chemical inventory management
- Protocol model to version control testing procedures
- Signature model for electronic signatures on reports
- Comment model for threaded discussions on samples
```
