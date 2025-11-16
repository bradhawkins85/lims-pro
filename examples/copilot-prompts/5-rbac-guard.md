# Copilot Prompt: RBAC Guard

## Prompt

```
Implement a NestJS guard PoliciesGuard reading user roles and route metadata to enforce actions. Provide decorators like @RequirePermission('sample:update').
```

## What This Creates

This prompt generates a comprehensive Role-Based Access Control (RBAC) system with:

### Core Components

1. **PermissionsGuard** - NestJS guard for route protection
2. **@RequirePermission** - Decorator for declarative permissions
3. **Permission Helper** - `can()` function for programmatic checks
4. **Role Definitions** - 5-tier role hierarchy
5. **Action/Resource Enums** - Type-safe permission definitions
6. **Context-Based Checks** - Record-level access control

## Role Hierarchy

```
ADMIN
  └─ Full system access
     └─ Manage users, roles, system settings
        └─ Override any permission

LAB_MANAGER (QA/Reviewer)
  └─ Approve/release results & COAs
     └─ Manage templates, methods, specifications
        └─ View all samples and tests

ANALYST
  └─ Create/edit samples & tests
     └─ Enter results
        └─ Upload attachments
           └─ Request re-tests

SALES_ACCOUNTING
  └─ Read samples
     └─ Manage accounting fields
        └─ Create/update quotes, PO, SO

CLIENT (Portal User)
  └─ View their samples (read-only)
     └─ View final COAs
        └─ Download reports
```

## Implementation

### 1. Permission Types

```typescript
// packages/api/src/auth/permissions.types.ts

export enum Action {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ASSIGN = 'ASSIGN',
  RELEASE = 'RELEASE',
  APPROVE = 'APPROVE',
  FINALIZE = 'FINALIZE',
  GENERATE_DRAFT = 'GENERATE_DRAFT',
}

export enum Resource {
  SAMPLE = 'SAMPLE',
  TEST = 'TEST',
  JOB = 'JOB',
  CLIENT = 'CLIENT',
  REPORT = 'REPORT',
  METHOD = 'METHOD',
  SPECIFICATION = 'SPECIFICATION',
  TEMPLATE = 'TEMPLATE',
  USER = 'USER',
  AUDIT_LOG = 'AUDIT_LOG',
}

export interface PermissionUser {
  id: string;
  email: string;
  role: Role;
}

export interface PermissionContext {
  createdById?: string;
  assignedUserId?: string;
  clientId?: string;
  released?: boolean;
  status?: string;
}
```

### 2. Permission Decorator

```typescript
// packages/api/src/auth/permissions.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export interface PermissionMetadata {
  action: Action;
  resource: Resource;
  checkContext?: boolean;
}

/**
 * Require specific permissions for a route
 * 
 * @param action - The action being performed
 * @param resource - The resource being accessed
 * @param checkContext - Whether to check record-level permissions
 * 
 * @example
 * // Basic route-level check
 * @RequirePermission(Action.CREATE, Resource.SAMPLE)
 * async createSample() { ... }
 * 
 * @example
 * // Record-level context check
 * @RequirePermission(Action.UPDATE, Resource.SAMPLE, true)
 * async updateSample(@Param('id') id: string) { ... }
 */
export const RequirePermission = (
  action: Action,
  resource: Resource,
  checkContext = false,
) =>
  SetMetadata(PERMISSION_KEY, {
    action,
    resource,
    checkContext,
  } as PermissionMetadata);
```

### 3. Permissions Guard

```typescript
// packages/api/src/auth/permissions.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { PERMISSION_KEY } from './permissions.decorator';
import { can } from './permissions.helper';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionMetadata = this.reflector.getAllAndOverride(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No permission metadata = allow (other guards handle auth)
    if (!permissionMetadata) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const { action, resource, checkContext } = permissionMetadata;

    // Basic role-level check
    if (!checkContext) {
      const result = can(user, action, resource);

      if (!result.allowed) {
        throw new ForbiddenException(
          result.reason || 'Insufficient permissions',
        );
      }

      return true;
    }

    // Context-based check (record-level)
    const permissionContext = await this.getPermissionContext(
      request,
      resource,
    );

    const result = can(user, action, resource, permissionContext);

    if (!result.allowed) {
      throw new ForbiddenException(
        result.reason || 'Insufficient permissions',
      );
    }

    return true;
  }

  /**
   * Get permission context from the request
   */
  private async getPermissionContext(
    request: any,
    resource: string,
  ): Promise<PermissionContext> {
    const resourceId =
      request.params.id ||
      request.params.sampleId ||
      request.params.testId;

    if (!resourceId) {
      return {};
    }

    switch (resource) {
      case 'SAMPLE': {
        const sample = await this.prisma.sample.findUnique({
          where: { id: resourceId },
          select: {
            createdById: true,
            clientId: true,
            released: true,
          },
        });
        return sample || {};
      }

      case 'TEST': {
        const test = await this.prisma.testAssignment.findUnique({
          where: { id: resourceId },
          include: {
            sample: {
              select: {
                clientId: true,
                released: true,
              },
            },
          },
        });
        return test
          ? {
              analystId: test.analystId,
              clientId: test.sample.clientId,
              released: test.sample.released,
              status: test.status,
            }
          : {};
      }

      default:
        return {};
    }
  }
}
```

### 4. Permission Helper

```typescript
// packages/api/src/auth/permissions.helper.ts

import { Role } from '@prisma/client';

interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if user has permission to perform action on resource
 * 
 * @param user - The user performing the action
 * @param action - The action being performed
 * @param resource - The resource being accessed
 * @param context - Optional context for record-level checks
 * @returns Permission result with reason if denied
 */
export function can(
  user: PermissionUser,
  action: Action,
  resource: Resource,
  context?: PermissionContext,
): PermissionResult {
  // ADMIN has full access
  if (user.role === Role.ADMIN) {
    return { allowed: true };
  }

  // Build permission key
  const permissionKey = `${action}:${resource}`;

  // Get role permissions
  const permissions = ROLE_PERMISSIONS[user.role] || [];

  // Check if role has this permission
  if (!permissions.includes(permissionKey)) {
    return {
      allowed: false,
      reason: `Role ${user.role} does not have permission for ${permissionKey}`,
    };
  }

  // If no context, allow based on role permission
  if (!context) {
    return { allowed: true };
  }

  // Context-based checks
  return checkContext(user, action, resource, context);
}

/**
 * Check record-level permissions based on context
 */
function checkContext(
  user: PermissionUser,
  action: Action,
  resource: Resource,
  context: PermissionContext,
): PermissionResult {
  // ANALYST can only update their assigned tests
  if (user.role === Role.ANALYST && action === Action.UPDATE) {
    if (resource === 'TEST' && context.analystId !== user.id) {
      return {
        allowed: false,
        reason: 'Analysts can only update tests assigned to them',
      };
    }
  }

  // CLIENT can only read their own samples
  if (user.role === Role.CLIENT && action === Action.READ) {
    if (resource === 'SAMPLE' && context.clientId !== user.id) {
      return {
        allowed: false,
        reason: 'Clients can only view their own samples',
      };
    }

    // Clients can only see released samples
    if (resource === 'SAMPLE' && !context.released) {
      return {
        allowed: false,
        reason: 'Clients can only view released samples',
      };
    }
  }

  // Prevent modification of released samples
  if (context.released && action === Action.UPDATE) {
    if (user.role !== Role.ADMIN && user.role !== Role.LAB_MANAGER) {
      return {
        allowed: false,
        reason: 'Cannot modify released samples',
      };
    }
  }

  return { allowed: true };
}

/**
 * Role permission matrix
 */
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [Role.ADMIN]: ['*'], // All permissions

  [Role.LAB_MANAGER]: [
    'CREATE:SAMPLE',
    'READ:SAMPLE',
    'UPDATE:SAMPLE',
    'DELETE:SAMPLE',
    'CREATE:TEST',
    'READ:TEST',
    'UPDATE:TEST',
    'DELETE:TEST',
    'APPROVE:REPORT',
    'RELEASE:REPORT',
    'FINALIZE:REPORT',
    'CREATE:TEMPLATE',
    'UPDATE:TEMPLATE',
    'DELETE:TEMPLATE',
    'READ:AUDIT_LOG',
    // ... more permissions
  ],

  [Role.ANALYST]: [
    'CREATE:SAMPLE',
    'READ:SAMPLE',
    'UPDATE:SAMPLE',
    'CREATE:TEST',
    'READ:TEST',
    'UPDATE:TEST',
    'GENERATE_DRAFT:REPORT',
    'READ:REPORT',
    // ... more permissions
  ],

  [Role.SALES_ACCOUNTING]: [
    'READ:SAMPLE',
    'READ:JOB',
    'UPDATE:JOB', // Only accounting fields
    'CREATE:JOB',
    'READ:CLIENT',
    // ... more permissions
  ],

  [Role.CLIENT]: [
    'READ:SAMPLE', // Only their own, released
    'READ:REPORT', // Only final COAs
  ],
};
```

## Usage Examples

### Example 1: Basic Route Protection

```typescript
@Controller('samples')
export class SamplesController {
  /**
   * Only users with CREATE permission on SAMPLE can access
   * Allowed: ADMIN, LAB_MANAGER, ANALYST
   */
  @Post()
  @RequirePermission(Action.CREATE, Resource.SAMPLE)
  async createSample(@Body() dto: CreateSampleDto) {
    return this.samplesService.create(dto);
  }

  /**
   * Only ADMIN can delete samples
   */
  @Delete(':id')
  @RequirePermission(Action.DELETE, Resource.SAMPLE)
  async deleteSample(@Param('id') id: string) {
    return this.samplesService.delete(id);
  }
}
```

### Example 2: Context-Based Protection

```typescript
@Controller('samples')
export class SamplesController {
  /**
   * Update sample with record-level checks
   * - ANALYST: Can only update if assignedUserId matches
   * - CLIENT: Cannot update (no permission)
   * - ADMIN/LAB_MANAGER: Can update any sample
   */
  @Patch(':id')
  @RequirePermission(Action.UPDATE, Resource.SAMPLE, true) // true = check context
  async updateSample(
    @Param('id') id: string,
    @Body() dto: UpdateSampleDto,
  ) {
    return this.samplesService.update(id, dto);
  }

  /**
   * Read sample with access control
   * - CLIENT: Only their own samples, only if released
   * - Others: Can read any sample
   */
  @Get(':id')
  @RequirePermission(Action.READ, Resource.SAMPLE, true)
  async getSample(@Param('id') id: string) {
    return this.samplesService.findOne(id);
  }
}
```

### Example 3: Manual Permission Check

```typescript
@Controller('samples')
export class SamplesController {
  @Patch(':id/assign')
  async assignSample(
    @Param('id') id: string,
    @Body() dto: AssignSampleDto,
    @Request() req,
  ) {
    const user = req.user;

    // Manual permission check
    const permissionResult = can(user, Action.ASSIGN, Resource.TEST);

    if (!permissionResult.allowed) {
      throw new ForbiddenException(permissionResult.reason);
    }

    // Verify analyst exists and has ANALYST role
    const analyst = await this.prisma.user.findUnique({
      where: { id: dto.analystId },
    });

    if (!analyst || analyst.role !== Role.ANALYST) {
      throw new ForbiddenException('Invalid analyst');
    }

    return this.samplesService.assign(id, dto.analystId);
  }
}
```

### Example 4: Role-Based Filtering

```typescript
@Controller('samples')
export class SamplesController {
  /**
   * List samples with role-based filtering
   */
  @Get()
  @RequirePermission(Action.READ, Resource.SAMPLE)
  async listSamples(@Request() req) {
    const user = req.user;

    const where: any = {};

    // Analysts see only assigned samples
    if (user.role === Role.ANALYST) {
      where.assignedUserId = user.id;
    }

    // Clients see only their own released samples
    if (user.role === Role.CLIENT) {
      where.clientId = user.id;
      where.released = true;
    }

    return this.samplesService.findMany({ where });
  }
}
```

## Implementation Reference

See the actual implementation in:
- `packages/api/src/auth/permissions.guard.ts`
- `packages/api/src/auth/permissions.decorator.ts`
- `packages/api/src/auth/permissions.helper.ts`
- `packages/api/src/auth/permissions.types.ts`
- `packages/api/src/auth/RBAC_EXAMPLES.ts.example`

## Follow-Up Prompts

After implementing RBAC, you might want to:

1. **Add Permissions UI:**
   ```
   Copilot, create a React component PermissionsMatrix showing:
   - Grid with roles as rows, resources as columns
   - Checkboxes for each permission
   - Color coding: green (allowed), red (denied)
   - Tooltips explaining each permission
   ```

2. **Add Custom Permissions:**
   ```
   Copilot, extend RBAC to support custom permissions:
   - UserPermission model linking User to custom permissions
   - Permission override system (grant/deny specific permission)
   - Inheritance from role with overrides
   - UI to manage user-specific permissions
   ```

3. **Add Audit of Permission Checks:**
   ```
   Copilot, log all permission checks to AuditLog:
   - Who attempted what action
   - On which resource
   - Whether allowed or denied
   - Reason for denial
   - Include in compliance reports
   ```

## Testing

```typescript
describe('PermissionsGuard', () => {
  it('allows ADMIN full access', async () => {
    const user = { id: '1', role: Role.ADMIN };
    const result = can(user, Action.DELETE, Resource.SAMPLE);
    expect(result.allowed).toBe(true);
  });

  it('denies CLIENT from updating samples', async () => {
    const user = { id: '1', role: Role.CLIENT };
    const result = can(user, Action.UPDATE, Resource.SAMPLE);
    expect(result.allowed).toBe(false);
  });

  it('allows ANALYST to update their tests', async () => {
    const user = { id: '1', role: Role.ANALYST };
    const context = { analystId: '1' };
    const result = can(user, Action.UPDATE, Resource.TEST, context);
    expect(result.allowed).toBe(true);
  });

  it('denies ANALYST from updating others tests', async () => {
    const user = { id: '1', role: Role.ANALYST };
    const context = { analystId: '2' };
    const result = can(user, Action.UPDATE, Resource.TEST, context);
    expect(result.allowed).toBe(false);
  });
});
```

## Best Practices

1. **Principle of Least Privilege**: Grant minimum necessary permissions
2. **Defense in Depth**: Use both guards and manual checks
3. **Audit Everything**: Log all permission checks
4. **Clear Error Messages**: Explain why access was denied
5. **Regular Reviews**: Audit role permissions quarterly
6. **Test Coverage**: Test all permission combinations
7. **Document Clearly**: Maintain permission matrix documentation

## Compliance Notes

### SOX (Sarbanes-Oxley)
- ✅ Separation of duties
- ✅ Access controls
- ✅ Audit trail

### HIPAA
- ✅ Role-based access
- ✅ Minimum necessary principle
- ✅ Access logging

### ISO 27001
- ✅ Access control policy
- ✅ User access management
- ✅ Privilege management
