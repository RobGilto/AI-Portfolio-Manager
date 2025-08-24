# Code Patterns & Templates

## Working Patterns
*Code approaches that consistently work well in this project*

### Pattern: [Name]
**Use Case**: [When to use this pattern]
**Template**:
```javascript
// PURPOSE: [Clear single responsibility]
// SCOPE: [What this does and doesn't do]
// IMPORTS: [Max 3, each justified]

[Code template]
```
**Why It Works**: [Explanation of benefits]
**File Size Impact**: [Typical line count]

### Pattern: [Name]
**Use Case**: [When appropriate]
**Template**:
```javascript
[Code example]
```
**Why It Works**: [Benefits]
**File Size Impact**: [Line count]

## Anti-Patterns to Avoid
*Approaches that consistently cause problems*

### Anti-Pattern: [Name]
**Why It Fails**: [Specific problems it causes]
**File Size Impact**: [How it bloats code]
**Better Alternative**: [What to do instead]

### Anti-Pattern: [Name]
**Why It Fails**: [Problems]
**File Size Impact**: [Bloat factor]
**Better Alternative**: [Alternative]

## Component Templates

### Minimal React Component
```javascript
// PURPOSE: [Single UI responsibility]
// SCOPE: [What this component renders/handles]
// IMPORTS: [Max 3 imports with justification]

import React from 'react';

export function ComponentName({ prop1, prop2 }) {
  // Single responsibility implementation
  return (
    <div>
      {/* Minimal UI */}
    </div>
  );
}
```

### Service Module
```javascript
// PURPOSE: [Single business function]
// SCOPE: [Clear boundaries of responsibility]
// IMPORTS: [Essential dependencies only]

export class ServiceName {
  // Focused, single-purpose methods
}
```

## Refactoring Patterns

### When File Hits 250 Lines
1. **Extract Components**: Move JSX blocks to separate files
2. **Extract Services**: Move business logic to service modules
3. **Extract Utils**: Move pure functions to utils (sparingly)
4. **Split by Feature**: Divide large features into smaller ones

### Import Reduction Strategies
- Combine related imports from same package
- Question every import's necessity
- Prefer standard library over external packages
- Use dynamic imports for optional features

---
*Patterns evolve with the project. Update regularly but keep focused.*