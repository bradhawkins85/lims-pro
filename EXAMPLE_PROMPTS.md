# Example Prompts for Copilot

This document contains example prompts that can be pasted into GitHub Copilot chat or used as inline comments to implement key features of the Laboratory LIMS Pro system. These prompts demonstrate how to leverage Copilot to build complex LIMS functionality.

## Table of Contents

1. [Schema Definition](#1-schema-definition)
2. [Audit Triggers](#2-audit-triggers)
3. [COA Export Service](#3-coa-export-service)
4. [OOS Rule Function](#4-oos-rule-function)
5. [RBAC Guard](#5-rbac-guard)
6. [Tests Grid Component](#6-tests-grid-component)
7. [PDF Template](#7-pdf-template)

---

## 1. Schema Definition

**Prompt:**
```
Copilot, in schema.prisma, define models for User, Role, UserRole, Client, Method, Specification, Section, TestDefinition, TestPack, TestPackItem, Job, Sample, TestAssignment, Attachment, COAReport, AuditLog. Use UUID ids, timestamps, FKs, and JSONB where specified in PRD §2. Add indexes for lookups and (sampleId,status). Generate migrations.
```

**What this creates:**
- Complete Prisma schema with all required models
- UUID primary keys for all entities
- Timestamp fields (createdAt, updatedAt) with audit tracking
- Foreign key relationships with proper cascade rules
- JSONB fields for flexible metadata and snapshots
- Strategic indexes for performance
- Enum types for status fields

**Implementation reference:** See `packages/api/prisma/schema.prisma`

---

## 2. Audit Triggers

**Prompt:**
```
Create a PostgreSQL migration that defines a generic audit.if_modified_func() PL/pgSQL function producing per‑field diffs as JSONB and an audit_log table (immutable). Add triggers on INSERT/UPDATE/DELETE for all business tables. Include actorId, ip, userAgent via SET LOCAL fallback to null.
```

**What this creates:**
- Generic PL/pgSQL trigger function for automatic audit logging
- Function to retrieve audit context from session variables
- Per-field diff tracking in JSONB format
- Triggers on all business tables (Job, Sample, TestAssignment, etc.)
- Immutable audit log table
- Context tracking: actorId, actorEmail, ip, userAgent

**Implementation reference:** See `packages/api/prisma/migrations/20251114063500_add_audit_triggers/migration.sql`

---

## 3. COA Export Service

**Prompt:**
```
Implement CoaService.export(sampleId, actorId) that: builds dataSnapshot from Sample + TestAssignments, renders HTML using lab template settings, converts to PDF via Puppeteer, increments version, stores COAReport with htmlSnapshot, dataSnapshot, pdfKey, reportedAt, reportedById. Mark previous final as superseded.
```

**What this creates:**
- COA export service with version control
- Data snapshot builder that captures sample and test data
- HTML template renderer with lab settings
- PDF generation using Puppeteer
- Version increment logic
- Storage integration (MinIO/S3)
- Superseded status marking for previous versions
- Complete audit trail

**Implementation reference:** See `packages/api/src/coa-reports/coa-reports.service.ts`

Key methods:
- `exportCOA()` - Main export function
- `buildDataSnapshot()` - Captures immutable data
- `buildHTMLSnapshot()` - Renders HTML template
- `finalizeCOA()` - Finalizes draft reports

---

## 4. OOS Rule Function

**Prompt:**
```
Create a function isOOS(result, specification) supporting comparators: equals, notEquals, lt, lte, gt, gte, betweenInclusive. Return boolean and reason string.
```

**What this creates:**
- Function to evaluate Out-of-Specification (OOS) status
- Support for multiple comparators:
  - Equals / Not Equals
  - Less Than (lt) / Less Than or Equal (lte)
  - Greater Than (gt) / Greater Than or Equal (gte)
  - Between Inclusive
- Numeric range validation (min/max)
- Target value matching for non-numeric results
- Custom OOS rule parsing
- Human-readable reason messages

**Implementation reference:** See `packages/shared/oos.ts`

Key functions:
- `computeOOS()` - Main OOS evaluation
- `getOOSMessage()` - Human-readable status message
- `hasSpecificationRules()` - Check if spec has rules

---

## 5. RBAC Guard

**Prompt:**
```
Implement a NestJS guard PoliciesGuard reading user roles and route metadata to enforce actions. Provide decorators like @RequirePermission('sample:update').
```

**What this creates:**
- NestJS PermissionsGuard for RBAC enforcement
- Role-based access control matrix
- Action and Resource enums
- Context-based permission checking
- Decorators for route protection:
  - `@RequirePermission(action, resource)`
  - `@RequirePermission(action, resource, true)` for context checks
- Permission helper function `can(user, action, resource, context?)`
- Record-level access control

**Implementation reference:**
- Guard: `packages/api/src/auth/permissions.guard.ts`
- Decorator: `packages/api/src/auth/permissions.decorator.ts`
- Helper: `packages/api/src/auth/permissions.helper.ts`
- Types: `packages/api/src/auth/permissions.types.ts`

Role hierarchy:
- ADMIN: Full access
- LAB_MANAGER: QA/Reviewer - approve/release results & COAs
- ANALYST: Create/edit samples & tests, enter results
- SALES_ACCOUNTING: Read samples, manage accounting fields
- CLIENT: Portal view (read-only)

---

## 6. Tests Grid Component

**Prompt:**
```
Build a React editable grid for TestAssignment with columns listed in PRD §3.2, client‑side Zod validation, and optimistic updates via TanStack Query. Provide buttons to add packs by calling /samples/:id/tests:add-pack.
```

**What this creates:**
- React component for editable test grid
- Inline editing capabilities
- Columns:
  - Test Name
  - Section
  - Method
  - Specification (with min/max/target)
  - Result
  - Result Unit
  - Status
  - OOS (auto-calculated)
  - Analyst
  - Test Date
  - Comments
- Client-side validation
- Auto-calculation of OOS flag
- Visual indicators for OOS results
- Optimistic updates
- Add test pack functionality

**Implementation reference:** See `packages/web/components/TestsGrid.tsx`

Key features:
- Editable cells with validation
- OOS auto-calculation on result change
- Status-based styling
- Integration with shared OOS utilities

---

## 7. PDF Template

**Prompt:**
```
Create a semantic, print‑ready HTML template for COA with header/footer, lab logo, Sample Info block, and paginated Tests table. No external CSS frameworks at render time; inline CSS; ensure page breaks between rows if needed.
```

**What this creates:**
- Semantic HTML5 template for Certificate of Analysis
- Print-ready layout with:
  - Header with lab logo and name
  - Report metadata (version, date, generated by)
  - Sample information block
  - Client information
  - Tests results table with specifications
  - Footer with disclaimer text
- Inline CSS for PDF generation compatibility
- Page break controls for multi-page reports
- Professional typography and spacing
- Responsive table layout
- Status indicators and OOS highlighting

**Implementation reference:** See `packages/api/src/modules/coa/renderer.ts`

Key components:
- `renderCOATemplate()` - Main template renderer
- `COADataSnapshot` - Type-safe data structure
- `COATemplateSettings` - Configurable template options
- Support for:
  - Custom field visibility
  - Label overrides
  - Column ordering

---

## Usage Tips

### Using these prompts with Copilot:

1. **Inline Comments:** Paste the prompt as a comment above where you want to implement the feature
   ```typescript
   // Copilot, implement CoaService.export(sampleId, actorId) that: builds dataSnapshot...
   ```

2. **Chat Interface:** Copy the entire prompt into Copilot Chat
   - Use `@workspace` for workspace-aware suggestions
   - Reference specific files with `#file:`

3. **Iterative Refinement:** Start with the base prompt, then add:
   - "Add error handling for..."
   - "Include validation for..."
   - "Add tests for..."

4. **Context Enhancement:** Provide additional context:
   - "Following the patterns in `auth/permissions.guard.ts`..."
   - "Using the same structure as `samples.service.ts`..."
   - "Consistent with our Prisma schema..."

### Best Practices

1. **Start with Schema:** Always implement database schema first
2. **Add Audit Early:** Implement audit logging before business logic
3. **Test Incrementally:** Test each component as you build it
4. **Follow Patterns:** Reference existing implementations for consistency
5. **Security First:** Add RBAC guards to all endpoints
6. **Validate Input:** Use Zod or class-validator for all inputs
7. **Document APIs:** Add OpenAPI/Swagger decorators

### Combining Prompts

You can combine prompts for related features:

```
Copilot, implement these related features:

1. Create a TestPacksService with methods to:
   - Create a new test pack
   - Add test definitions to a pack
   - Apply a pack to a sample (create TestAssignments)

2. Add RBAC protection:
   - Only ADMIN and LAB_MANAGER can create packs
   - Only ADMIN, LAB_MANAGER, and ANALYST can apply packs

3. Add a React component TestPackSelector:
   - List available test packs
   - Show included tests when hovering
   - Apply selected pack to current sample
   - Show loading and success states

Follow patterns from existing services and components.
```

---

## Related Documentation

- [Schema Documentation](./SCHEMA_DOCUMENTATION.md)
- [Audit Logging Documentation](./AUDIT_LOGGING_DOCUMENTATION.md)
- [RBAC Implementation Summary](./RBAC_IMPLEMENTATION_SUMMARY.md)
- [API Implementation Summary](./API_IMPLEMENTATION_SUMMARY.md)
- [PDF Report Documentation](./PDF_REPORT_DOCUMENTATION.md)

---

## Contributing

When adding new features, consider creating example prompts for:
- Complex business logic
- New API endpoints
- UI components
- Database migrations
- Integration patterns

This helps maintain consistency and serves as documentation for the development patterns used in the project.
