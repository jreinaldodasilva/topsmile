# Code Duplication Analysis - TopSmile Repository

## Objective
Identify and quantify code duplication across the monorepo, prioritizing consolidation opportunities that reduce maintenance burden without increasing coupling.

## Scope
- Exact code duplicates (copy-paste)
- Semantic duplicates (similar logic with variations)
- Redundant utilities and helper functions
- Duplicate type definitions
- Repeated patterns (validation, error handling, API calls)

## Analysis Checklist

### 1. Exact Duplication Detection
- [ ] Scan for identical code blocks >10 lines (80%+ similarity)
- [ ] Check for copy-pasted functions across files
- [ ] Find duplicate React components with minor prop differences
- [ ] Identify repeated API endpoint handlers
- [ ] Check for duplicated middleware functions
- [ ] Find copy-pasted validation logic

### 2. Semantic Duplication
- [ ] Similar error handling patterns (try-catch blocks)
- [ ] Repeated data transformation logic
- [ ] Similar API response formatting
- [ ] Redundant type guards and validators
- [ ] Repeated database query patterns
- [ ] Similar form validation logic across components

### 3. Cross-Package Duplication
- [ ] Types defined in multiple packages
- [ ] Utility functions duplicated between frontend/backend
- [ ] Constants redefined across packages
- [ ] Configuration schemas duplicated
- [ ] API client logic repeated
- [ ] Validation schemas duplicated

### 4. Redundant Utilities
- [ ] Multiple date formatting functions
- [ ] Duplicate string manipulation helpers
- [ ] Redundant array/object utilities (already in lodash)
- [ ] Multiple logger implementations
- [ ] Duplicate HTTP client wrappers
- [ ] Repeated pagination logic

### 5. Pattern Analysis
- [ ] Count instances of repeated patterns
- [ ] Identify the most frequently duplicated code
- [ ] Find the largest duplicate blocks
- [ ] Map duplication hotspots by file/package

### 6. Acceptable Duplication (DO NOT FLAG)
- [ ] Test fixtures and mock data
- [ ] Database migration files
- [ ] Generated code (Prisma, GraphQL)
- [ ] Different implementations for different contexts
- [ ] Intentional duplication for decoupling

## Deliverable Format

Create `DUPLICATION_REPORT.md` with:

```markdown
# Code Duplication Analysis Report

## Executive Summary
- Total files analyzed: [X]
- Duplication rate: [Y%] of codebase
- Top 3 duplication hotspots: [files/patterns]
- Estimated consolidation effort: [hours]
- Maintenance burden reduction: [High/Medium/Low]

## Metrics

| Metric | Value |
|--------|-------|
| Exact duplicates (>10 lines) | X instances |
| Semantic duplicates | Y instances |
| Cross-package duplication | Z instances |
| Redundant utilities | N functions |
| Average duplicate block size | M lines |
| Largest duplicate block | L lines |

## Critical Duplication Issues

### DUP-001: [Duplicate Pattern Name]
**Severity**: High/Medium/Low
**Impact**: [Maintenance burden / bug propagation risk]
**Instances**: [X locations]
**Lines Affected**: ~[Y] lines total

**Locations**:
1. `backend/src/services/userService.ts:L45-L78`
2. `backend/src/services/adminService.ts:L102-L135`
3. `frontend/src/utils/userHelpers.ts:L20-L53`

**Duplicated Code Pattern**:
```typescript
// Repeated in 3 places with minor variations
async function validateUserData(data: any) {
  if (!data.email) throw new Error('Email required');
  if (!data.password) throw new Error('Password required');
  if (data.password.length < 8) throw new Error('Password too short');
  // ... 20+ more lines of validation
}
```

**Maintenance Issues**:
- Bug fixes must be applied in 3 places
- Inconsistent error messages across locations
- Different validation rules emerging over time

**Consolidation Opportunity**:
```typescript
// Proposed: packages/shared/src/validation/userSchema.ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  // ... centralized validation
});

export const validateUser = (data: unknown) => userSchema.parse(data);
```

**Refactoring Strategy**:
1. Create shared validation package/module
2. Migrate usage site-by-site (can be gradual)
3. Add tests for consolidated validator
4. Deprecate old implementations

**Risk Assessment**:
- Breaking changes: Low (same interface)
- Coupling increase: Low (validation is a pure function)
- Effort: ~2 hours
- ROI: High (3 locations → 1, easier to maintain)

**Patch Available**: `patches/deduplication/001_consolidate_user_validation.patch`

---

## Duplication Heatmap

### High-Duplication Areas (>5 instances)
1. **Error handling middleware** - 8 similar implementations
2. **API response formatters** - 6 variations
3. **Date formatting utilities** - 5 duplicate functions

### Medium-Duplication Areas (3-5 instances)
1. **Database connection setup** - 4 instances
2. **Logger configuration** - 3 instances

### Cross-Package Duplication
```
Types Package          Backend                Frontend
     |                    |                      |
     |--- UserDTO --------|                      |
     |                    |--- UserDTO ----------|
     |                    |                      |
```
**Issue**: `UserDTO` defined in 3 places with drift

## Refactoring Opportunities (Prioritized)

### Quick Wins (Low Risk, High ROI)
1. **Extract validation schemas** - 3 hours, prevents future drift
2. **Consolidate error formatters** - 1 hour, improves consistency
3. **Share type definitions** - 2 hours, eliminates drift

### Medium Effort
4. **Create shared API client** - 4 hours, reduces maintenance
5. **Unify logger implementation** - 3 hours, consistent logging

### Complex Refactors (Deferred)
6. **Consolidate auth middleware** - 8 hours, requires careful testing
7. **Merge similar React components** - 12 hours, risk of breaking UI

## Redundant Utility Functions

### Functions That Could Use Lodash/Standard Libraries
```typescript
// Custom implementation found in 3 files
function groupBy(array, key) { ... }

// Use instead
import { groupBy } from 'lodash';
```

**Other Examples**:
- `deepClone()` → `structuredClone()` or `lodash.cloneDeep()`
- `debounce()` → `lodash.debounce()`
- `chunk()` → `lodash.chunk()`

**Savings**: Remove ~200 lines of custom utility code

## Type Duplication Analysis

### Duplicate Type Definitions
```typescript
// backend/src/types/user.ts
interface User {
  id: string;
  email: string;
  role: string;
}

// frontend/src/types/user.ts
interface User {  // Drifted: missing 'role'
  id: string;
  email: string;
}

// packages/shared/types/index.ts
export interface User {  // Another variation
  id: number;  // Different type!
  email: string;
  role: UserRole;  // Enum
}
```

**Recommendation**: Consolidate in `packages/shared/types` and enforce single source of truth

## Consolidation Roadmap

### Phase 1: Safe Extractions (Week 1)
- [ ] Move shared types to `packages/shared/types`
- [ ] Create validation schemas package
- [ ] Extract common constants

### Phase 2: Utility Consolidation (Week 2)
- [ ] Create shared utilities package
- [ ] Migrate to lodash where appropriate
- [ ] Remove redundant custom implementations

### Phase 3: Pattern Consolidation (Week 3-4)
- [ ] Unify error handling
- [ ] Consolidate API response formatting
- [ ] Merge similar middleware

## Tools Recommendation

**For automated detection**:
```bash
# jscpd - JavaScript Copy/Paste Detector
npx jscpd --min-lines 10 --min-tokens 50 src/

# jsinspect - Structural similarity
npx jsinspect -t 30 src/
```

## Assumptions Made
- Duplication >10 lines is significant
- 80%+ similarity threshold for flagging
- Test code duplication is acceptable
- Migration can be gradual (no big-bang refactor)
```

## Output Files

1. `DUPLICATION_REPORT.md` - Main report
2. `duplication_metrics.json`:
```json
{
  "summary": {
    "totalFiles": 0,
    "filesWithDuplication": 0,
    "duplicationRate": 0.0,
    "exactDuplicates": 0,
    "semanticDuplicates": 0,
    "crossPackageDuplicates": 0
  },
  "hotspots": [
    {
      "pattern": "error handling",
      "instances": 8,
      "locations": ["file1:L10-L20", "file2:L30-L40"],
      "estimatedLinesAffected": 120,
      "consolidationEffort": "2 hours",
      "roi": "high"
    }
  ],
  "issues": [
    {
      "id": "DUP-001",
      "title": "",
      "severity": "High|Medium|Low",
      "instances": 3,
      "locations": [],
      "maintenanceRisk": "High|Medium|Low",
      "refactoringComplexity": "Low|Medium|High",
      "patchAvailable": true
    }
  ]
}
```
3. `patches/deduplication/` - Safe consolidation patches
4. `duplication_heatmap.html` - Visual representation (if tool available)

## Commands to Run

```bash
# Install detection tools
npm install -g jscpd jsinspect

# Run duplication detection
jscpd --format "json" --output "./reports" src/

# Find similar code structures
jsinspect --threshold 30 --reporter json src/ > duplication.json

# Find duplicate type definitions
grep -rn "interface User" --include="*.ts" src/

# Count lines of duplicated code
jscpd src/ | grep "Duplication"
```

## Success Criteria
- Duplication rate documented with confidence intervals
- Top 5 consolidation opportunities identified with ROI analysis
- Patches available for low-risk consolidations
- Clear migration path for complex refactors
- No suggested consolidations that increase coupling unnecessarily