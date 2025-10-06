# TypeScript Strict Mode Guide

## Current Status

✅ **Strict mode is ENABLED** in both frontend and backend

### Frontend (tsconfig.json)
```json
{
  "strict": true,
  "noFallthroughCasesInSwitch": true,
  "forceConsistentCasingInFileNames": true
}
```

### Backend (backend/tsconfig.json)
```json
{
  "strict": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "forceConsistentCasingInFileNames": true
}
```

## Strict Mode Flags

### Enabled by `strict: true`
- ✅ `strictNullChecks` - Null and undefined handling
- ✅ `strictFunctionTypes` - Function type checking
- ✅ `strictBindCallApply` - Bind/call/apply checking
- ✅ `strictPropertyInitialization` - Class property initialization
- ✅ `noImplicitAny` - No implicit any types
- ✅ `noImplicitThis` - No implicit this
- ✅ `alwaysStrict` - Use strict mode

### Additional Strict Checks
- ✅ `noFallthroughCasesInSwitch` - Switch case fallthrough
- ✅ `forceConsistentCasingInFileNames` - File name casing
- ✅ `noImplicitReturns` - Function return types (backend)

## Common Type Errors & Fixes

### 1. Null/Undefined Checks
```tsx
// ❌ Error
const name = user.name.toUpperCase();

// ✅ Fix
const name = user.name?.toUpperCase() ?? 'Unknown';
```

### 2. Implicit Any
```tsx
// ❌ Error
function process(data) { }

// ✅ Fix
function process(data: any) { }
// Better
function process(data: UserData) { }
```

### 3. Type Assertions
```tsx
// ❌ Avoid
const element = document.getElementById('id') as HTMLElement;

// ✅ Better
const element = document.getElementById('id');
if (element) {
  // Use element safely
}
```

### 4. Optional Chaining
```tsx
// ❌ Error
const city = user.address.city;

// ✅ Fix
const city = user.address?.city;
```

### 5. Non-null Assertion
```tsx
// ⚠️ Use sparingly
const value = getValue()!;

// ✅ Better
const value = getValue();
if (value) {
  // Use value
}
```

## Type Safety Best Practices

### 1. Define Interfaces
```tsx
interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
}
```

### 2. Use Type Guards
```tsx
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'string';
}
```

### 3. Avoid Any
```tsx
// ❌ Bad
const data: any = fetchData();

// ✅ Good
const data: User = fetchData();

// ✅ Better
const data: User | null = fetchData();
```

### 4. Use Unknown for Unknowns
```tsx
// ❌ Bad
function process(data: any) { }

// ✅ Good
function process(data: unknown) {
  if (typeof data === 'string') {
    // data is string here
  }
}
```

### 5. Proper Event Types
```tsx
// ❌ Bad
const handleChange = (e: any) => { };

// ✅ Good
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { };
```

## Checking Compliance

### Run Type Check
```bash
# Frontend
npm run type-check

# Backend
cd backend && npm run type-check
```

### Fix Common Issues
```bash
# Find any type issues
tsc --noEmit

# Check specific file
tsc --noEmit src/path/to/file.ts
```

## Migration Strategy

If strict mode was disabled:

1. **Enable gradually**
   ```json
   {
     "strictNullChecks": true,
     "noImplicitAny": true
   }
   ```

2. **Fix errors by priority**
   - Critical paths first
   - High-traffic components
   - Shared utilities

3. **Use @ts-ignore sparingly**
   ```tsx
   // @ts-ignore - TODO: Fix type
   const value = legacyFunction();
   ```

4. **Document type decisions**
   ```tsx
   // Using any here because third-party library lacks types
   const plugin: any = require('legacy-plugin');
   ```

## Benefits

- ✅ Catch errors at compile time
- ✅ Better IDE autocomplete
- ✅ Safer refactoring
- ✅ Self-documenting code
- ✅ Reduced runtime errors

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Strict Mode Guide](https://www.typescriptlang.org/tsconfig#strict)
- [Type Checking JavaScript](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)
