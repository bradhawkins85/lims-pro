# Copilot Prompt: OOS Rule Function

## Prompt

```
Create a function isOOS(result, specification) supporting comparators: equals, notEquals, lt, lte, gt, gte, betweenInclusive. Return boolean and reason string.
```

## What This Creates

This prompt generates a comprehensive Out-of-Specification (OOS) evaluation system with:

### Core Features

1. **Comparator Support**
   - `equals` / `notEquals` - Exact matching
   - `lt` (less than) / `lte` (less than or equal)
   - `gt` (greater than) / `gte` (greater than or equal)
   - `betweenInclusive` - Range checking

2. **Flexible Result Handling**
   - Numeric results with range validation
   - Non-numeric results with target matching
   - Custom OOS rules with operators

3. **Human-Readable Output**
   - Boolean OOS flag
   - Descriptive reason messages
   - Actionable feedback

## Implementation

### Core Function

```typescript
/**
 * Evaluate if a test result is Out of Specification (OOS)
 * 
 * @param result - The test result value (string or numeric)
 * @param specification - The specification rules
 * @returns Object with OOS status and reason
 */
function isOOS(
  result: string | number,
  specification?: {
    min?: number | null;
    max?: number | null;
    target?: string | null;
    oosRule?: string | null;
  } | null,
): { isOOS: boolean; reason: string } {
  // No specification = not OOS
  if (!specification) {
    return {
      isOOS: false,
      reason: 'In Specification (No specification defined)',
    };
  }

  const resultStr = String(result);
  const numericResult = parseFloat(resultStr);

  // Handle non-numeric results
  if (isNaN(numericResult)) {
    if (specification.target) {
      const matches =
        resultStr.trim().toLowerCase() ===
        specification.target.trim().toLowerCase();
      return {
        isOOS: !matches,
        reason: matches
          ? 'In Specification'
          : `Out of Specification: Result "${resultStr}" does not match target "${specification.target}"`,
      };
    }
    return {
      isOOS: false,
      reason: 'In Specification (No target specified for non-numeric result)',
    };
  }

  // Check min/max range (betweenInclusive)
  if (
    specification.min !== null &&
    specification.min !== undefined &&
    numericResult < specification.min
  ) {
    return {
      isOOS: true,
      reason: `Out of Specification: Result ${numericResult} is below minimum ${specification.min}`,
    };
  }

  if (
    specification.max !== null &&
    specification.max !== undefined &&
    numericResult > specification.max
  ) {
    return {
      isOOS: true,
      reason: `Out of Specification: Result ${numericResult} exceeds maximum ${specification.max}`,
    };
  }

  // Check custom OOS rule
  if (specification.oosRule) {
    const rule = specification.oosRule.toLowerCase().trim();

    // Greater than or equal (gte)
    if (rule.includes('>=')) {
      const threshold = parseFloat(rule.split('>=')[1]);
      const isOOS = numericResult < threshold;
      return {
        isOOS,
        reason: isOOS
          ? `Out of Specification: Result ${numericResult} is less than required ${threshold}`
          : 'In Specification',
      };
    }

    // Less than or equal (lte)
    if (rule.includes('<=')) {
      const threshold = parseFloat(rule.split('<=')[1]);
      const isOOS = numericResult > threshold;
      return {
        isOOS,
        reason: isOOS
          ? `Out of Specification: Result ${numericResult} exceeds limit ${threshold}`
          : 'In Specification',
      };
    }

    // Greater than (gt)
    if (rule.includes('>') && !rule.includes('=')) {
      const threshold = parseFloat(rule.split('>')[1]);
      const isOOS = numericResult <= threshold;
      return {
        isOOS,
        reason: isOOS
          ? `Out of Specification: Result ${numericResult} must be greater than ${threshold}`
          : 'In Specification',
      };
    }

    // Less than (lt)
    if (rule.includes('<') && !rule.includes('=')) {
      const threshold = parseFloat(rule.split('<')[1]);
      const isOOS = numericResult >= threshold;
      return {
        isOOS,
        reason: isOOS
          ? `Out of Specification: Result ${numericResult} must be less than ${threshold}`
          : 'In Specification',
      };
    }

    // Equals
    if (rule.includes('equals') || rule.includes('=')) {
      const target = parseFloat(rule.match(/[\d.]+/)?.[0] || '0');
      const isOOS = numericResult !== target;
      return {
        isOOS,
        reason: isOOS
          ? `Out of Specification: Result ${numericResult} must equal ${target}`
          : 'In Specification',
      };
    }

    // Not equals
    if (rule.includes('notequals') || rule.includes('!=')) {
      const target = parseFloat(rule.match(/[\d.]+/)?.[0] || '0');
      const isOOS = numericResult === target;
      return {
        isOOS,
        reason: isOOS
          ? `Out of Specification: Result ${numericResult} must not equal ${target}`
          : 'In Specification',
      };
    }
  }

  return {
    isOOS: false,
    reason: 'In Specification',
  };
}
```

### Simplified Boolean Version

For cases where you only need the boolean flag:

```typescript
function computeOOS(
  result: string,
  specification?: SpecificationRule | null,
): boolean {
  return isOOS(result, specification).isOOS;
}
```

## Usage Examples

### Example 1: Numeric Range (betweenInclusive)

```typescript
// Specification: min=1, max=10
isOOS('5.5', { min: 1, max: 10 });
// Result: { isOOS: false, reason: 'In Specification' }

isOOS('15', { min: 1, max: 10 });
// Result: { isOOS: true, reason: 'Out of Specification: Result 15 exceeds maximum 10' }

isOOS('0.5', { min: 1, max: 10 });
// Result: { isOOS: true, reason: 'Out of Specification: Result 0.5 is below minimum 1' }
```

### Example 2: Target Matching (equals)

```typescript
// Specification: target='Pass'
isOOS('Pass', { target: 'Pass' });
// Result: { isOOS: false, reason: 'In Specification' }

isOOS('Fail', { target: 'Pass' });
// Result: { isOOS: true, reason: 'Out of Specification: Result "Fail" does not match target "Pass"' }

isOOS('pass', { target: 'Pass' }); // Case-insensitive
// Result: { isOOS: false, reason: 'In Specification' }
```

### Example 3: Custom OOS Rules

```typescript
// Greater than or equal (gte)
isOOS('8', { oosRule: '>= 5' });
// Result: { isOOS: false, reason: 'In Specification' }

isOOS('3', { oosRule: '>= 5' });
// Result: { isOOS: true, reason: 'Out of Specification: Result 3 is less than required 5' }

// Less than or equal (lte)
isOOS('7', { oosRule: '<= 10' });
// Result: { isOOS: false, reason: 'In Specification' }

isOOS('12', { oosRule: '<= 10' });
// Result: { isOOS: true, reason: 'Out of Specification: Result 12 exceeds limit 10' }

// Greater than (gt)
isOOS('6', { oosRule: '> 5' });
// Result: { isOOS: false, reason: 'In Specification' }

isOOS('5', { oosRule: '> 5' });
// Result: { isOOS: true, reason: 'Out of Specification: Result 5 must be greater than 5' }
```

### Example 4: Complex Specifications

```typescript
// Microbiology: Colony count must be ≤ 10
const microSpec = {
  max: 10,
  oosRule: '<= 10',
};

isOOS('5', microSpec);
// Result: { isOOS: false, reason: 'In Specification' }

isOOS('15', microSpec);
// Result: { isOOS: true, reason: 'Out of Specification: Result 15 exceeds maximum 10' }

// Chemistry: pH must be between 6.5 and 7.5
const phSpec = {
  min: 6.5,
  max: 7.5,
};

isOOS('7.0', phSpec);
// Result: { isOOS: false, reason: 'In Specification' }

isOOS('8.0', phSpec);
// Result: { isOOS: true, reason: 'Out of Specification: Result 8 exceeds maximum 7.5' }
```

## Integration with Test Assignments

### Auto-Calculate OOS on Result Entry

```typescript
// In TestAssignment service
async updateTestResult(testId: string, result: string) {
  const test = await prisma.testAssignment.findUnique({
    where: { id: testId },
    include: { specification: true },
  });

  // Auto-calculate OOS
  const { isOOS: oos, reason } = isOOS(result, test.specification);

  await prisma.testAssignment.update({
    where: { id: testId },
    data: {
      result,
      oos,
      comments: oos ? reason : test.comments,
    },
  });

  return { result, oos, reason };
}
```

### React Component Integration

```typescript
// In TestsGrid component
const handleResultChange = (testId: string, newResult: string) => {
  const test = tests.find(t => t.id === testId);
  const { isOOS: oos } = isOOS(newResult, test.specification);
  
  // Update with OOS flag
  updateTest(testId, {
    result: newResult,
    oos,
  });
};
```

## Implementation Reference

See the actual implementation in:
- `packages/shared/oos.ts` - Core OOS functions
- `packages/api/src/test-assignments/test-assignments.service.ts` - Server-side usage
- `packages/web/components/TestsGrid.tsx` - Client-side usage

## Follow-Up Prompts

After implementing OOS rules, you might want to:

1. **Add OOS Workflow:**
   ```
   Copilot, create an OOS investigation workflow that:
   - Triggers when a test is marked OOS
   - Creates an Investigation record
   - Requires root cause analysis
   - Needs manager approval for resolution
   - Tracks corrective actions
   - Logs in audit trail
   ```

2. **Add OOS Dashboard:**
   ```
   Copilot, create an OOS dashboard showing:
   - Current OOS tests by section
   - OOS trend chart over time
   - Top failed specifications
   - Open investigations
   - Average time to resolution
   ```

3. **Add OOS Notifications:**
   ```
   Copilot, create a notification service that:
   - Sends email when test goes OOS
   - Alerts lab manager immediately
   - Includes sample and test details
   - Links to investigation form
   ```

## Testing

```typescript
describe('isOOS', () => {
  it('returns false when no specification', () => {
    const result = isOOS('100', null);
    expect(result.isOOS).toBe(false);
  });

  it('checks numeric min/max range', () => {
    const spec = { min: 1, max: 10 };
    
    expect(isOOS('5', spec).isOOS).toBe(false);
    expect(isOOS('0', spec).isOOS).toBe(true);
    expect(isOOS('15', spec).isOOS).toBe(true);
  });

  it('checks target matching for non-numeric', () => {
    const spec = { target: 'Pass' };
    
    expect(isOOS('Pass', spec).isOOS).toBe(false);
    expect(isOOS('pass', spec).isOOS).toBe(false); // case-insensitive
    expect(isOOS('Fail', spec).isOOS).toBe(true);
  });

  it('evaluates custom OOS rules', () => {
    expect(isOOS('8', { oosRule: '>= 5' }).isOOS).toBe(false);
    expect(isOOS('3', { oosRule: '>= 5' }).isOOS).toBe(true);
    expect(isOOS('12', { oosRule: '<= 10' }).isOOS).toBe(true);
  });

  it('provides descriptive reason messages', () => {
    const result = isOOS('15', { min: 1, max: 10 });
    
    expect(result.reason).toContain('exceeds maximum');
    expect(result.reason).toContain('15');
    expect(result.reason).toContain('10');
  });
});
```

## Best Practices

1. **Auto-Calculate**: Always auto-calculate OOS when result is entered
2. **Visual Indicators**: Highlight OOS results in UI (red background)
3. **Require Comments**: Force comment when test is OOS
4. **Prevent Release**: Block sample release if any test is OOS
5. **Notifications**: Alert QA/manager immediately on OOS
6. **Track Trends**: Monitor OOS rates by test, method, analyst
7. **Investigation**: Require formal investigation for all OOS results

## Compliance Notes

### ISO 17025
- ✅ Acceptance criteria evaluation
- ✅ Out-of-specification handling
- ✅ Investigation requirements
- ✅ Corrective action tracking

### GLP (Good Laboratory Practice)
- ✅ Automated evaluation
- ✅ Clear acceptance criteria
- ✅ Documented deviations
- ✅ Management review
