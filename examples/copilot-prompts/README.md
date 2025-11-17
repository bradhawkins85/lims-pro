# Copilot Example Prompts

This directory contains detailed example prompts for implementing key features of the Laboratory LIMS Pro system using GitHub Copilot.

## 📁 Contents

### 1. [Schema Definition](./1-schema-definition.md)
**Prompt:** Define complete Prisma schema with UUID ids, timestamps, and strategic indexes

**Creates:**
- User, Role, and RBAC models
- Master data models (Client, Method, Specification, etc.)
- Operational models (Job, Sample, TestAssignment, etc.)
- Audit log model
- Comprehensive relationships and constraints

**Topics:** Database design, Prisma ORM, PostgreSQL, schema migrations

---

### 2. [Audit Triggers](./2-audit-triggers.md)
**Prompt:** Create PostgreSQL audit triggers for automatic change logging

**Creates:**
- Generic PL/pgSQL trigger function
- Audit context retrieval function
- Per-field diff tracking in JSONB
- Triggers on all business tables
- Immutable audit log

**Topics:** PostgreSQL triggers, PL/pgSQL, audit logging, compliance, JSONB

---

### 3. [COA Export Service](./3-coa-export-service.md)
**Prompt:** Implement COA export with version control and PDF generation

**Creates:**
- Data snapshot builder
- HTML template renderer
- PDF generation with Puppeteer
- Version increment logic
- Storage integration (MinIO/S3)
- Superseded status management

**Topics:** NestJS services, PDF generation, version control, object storage, immutable records

---

### 4. [OOS Rule Function](./4-oos-rule-function.md)
**Prompt:** Create Out-of-Specification evaluation function with multiple comparators

**Creates:**
- OOS evaluation function
- Support for: equals, notEquals, lt, lte, gt, gte, betweenInclusive
- Numeric range validation
- Target value matching
- Human-readable reason messages

**Topics:** Business logic, validation, TypeScript, shared utilities, testing

---

### 5. [RBAC Guard](./5-rbac-guard.md)
**Prompt:** Implement NestJS guard with role-based permissions and decorators

**Creates:**
- PermissionsGuard for route protection
- @RequirePermission decorator
- Permission helper functions
- 5-tier role hierarchy
- Context-based access control
- Record-level permissions

**Topics:** NestJS guards, RBAC, decorators, security, authorization, access control

---

### 6. [Tests Grid Component](./6-tests-grid-component.md)
**Prompt:** Build React editable grid with validation and optimistic updates

**Creates:**
- Editable test grid component
- Inline editing
- Zod validation
- TanStack Query integration
- Optimistic updates
- Auto-OOS calculation
- Test pack management

**Topics:** React, TanStack Query, Zod, forms, validation, optimistic UI, state management

---

### 7. [PDF Template](./7-pdf-template.md)
**Prompt:** Create semantic, print-ready HTML template for Certificate of Analysis

**Creates:**
- Professional COA HTML template
- Print-optimized layout
- Inline CSS (no external dependencies)
- Header with logo
- Sample information block
- Tests results table
- Footer with disclaimer
- Page break controls

**Topics:** HTML templates, CSS, PDF generation, print styles, typography, accessibility

---

## 🚀 How to Use These Prompts

### Method 1: Inline Comments
Paste the prompt as a comment in your code where you want the implementation:

```typescript
// Copilot, implement CoaService.export(sampleId, actorId) that: builds dataSnapshot from Sample + TestAssignments...
```

Then let Copilot suggest the implementation.

### Method 2: Chat Interface
1. Open GitHub Copilot Chat
2. Copy the entire prompt from the example file
3. Paste into chat
4. Use `@workspace` for workspace-aware suggestions
5. Reference specific files with `#file:path/to/file.ts`

### Method 3: Context-Enhanced
Provide additional context to improve suggestions:

```
Following the patterns in #file:auth/permissions.guard.ts, implement a guard for...
```

## 💡 Tips for Best Results

### 1. Start with Schema
Always implement the database schema first. This provides context for all other features.

### 2. Build Incrementally
Implement features in order:
1. Database schema
2. Audit logging
3. Core services
4. API endpoints
5. Frontend components

### 3. Reference Existing Code
Point Copilot to existing implementations:
```
Following the same structure as samples.service.ts, create a methods.service.ts...
```

### 4. Add Validation Early
Include validation requirements in your prompts:
```
...with Zod validation for all inputs and error handling for edge cases
```

### 5. Test as You Go
Request tests with your implementation:
```
...and create Jest tests covering happy path and error cases
```

## 📚 Related Documentation

- [Main Example Prompts Doc](../../EXAMPLE_PROMPTS.md) - Overview with all prompts
- [Schema Documentation](../../SCHEMA_DOCUMENTATION.md) - Database schema details
- [Audit Logging Documentation](../../AUDIT_LOGGING_DOCUMENTATION.md) - Audit system details
- [RBAC Implementation Summary](../../RBAC_IMPLEMENTATION_SUMMARY.md) - Authorization details
- [API Implementation Summary](../../API_IMPLEMENTATION_SUMMARY.md) - API patterns
- [PDF Report Documentation](../../PDF_REPORT_DOCUMENTATION.md) - COA generation details

## 🎯 Common Patterns

### Combining Prompts
You can combine multiple prompts for related features:

```
Copilot, implement these related features:

1. Create a TestPacksService with CRUD operations
2. Add RBAC protection (only ADMIN and LAB_MANAGER can create)
3. Create a React component TestPackSelector
4. Add Zod validation for all inputs
5. Include Jest tests for the service

Follow patterns from existing services and use the established RBAC decorators.
```

### Extending Prompts
Start with a base prompt, then refine:

```
[Paste base prompt]

Additionally:
- Add error handling for network failures
- Include loading and success states
- Add optimistic updates
- Include accessibility features (ARIA labels, keyboard navigation)
```

## 🔧 Customization

Each example file includes a "Follow-Up Prompts" section with suggestions for extending the feature.

Example:
- Add bulk operations
- Add filtering and sorting
- Add export functionality
- Add history view

## ✅ Best Practices

1. **Be Specific**: Include exact field names, types, and requirements
2. **Reference Standards**: Mention compliance requirements (FDA, ISO, etc.)
3. **Include Context**: Reference related files and patterns
4. **Request Tests**: Always ask for test coverage
5. **Security First**: Include authentication and authorization requirements
6. **Document Intent**: Explain why you need each feature

## 🤝 Contributing

When adding new example prompts:

1. Follow the same structure as existing examples
2. Include:
   - Clear prompt text
   - What the prompt creates
   - Implementation details
   - Usage examples
   - Follow-up prompts
   - Testing examples
   - Best practices
3. Reference actual implementation files
4. Add compliance notes where relevant

## 📖 Learning Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Prompt Engineering Guide](https://docs.github.com/en/copilot/using-github-copilot/prompt-engineering-for-github-copilot)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)
- [TanStack Query Documentation](https://tanstack.com/query)

## 🆘 Need Help?

If you're stuck:
1. Check the referenced implementation files
2. Review the main documentation files
3. Look at existing similar features
4. Break the prompt into smaller pieces
5. Ask Copilot to explain the existing code first

## 📝 License

These example prompts are part of the Laboratory LIMS Pro project and are subject to the same MIT license.
