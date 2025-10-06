# Code Documentation Standards

## Overview

This guide defines documentation standards for TopSmile codebase to ensure consistency and maintainability.

## JSDoc Standards

### Functions and Methods

```typescript
/**
 * Brief description of what the function does
 * @param paramName - Parameter description
 * @param optionalParam - Optional parameter description (optional)
 * @returns Description of return value
 * @throws {ErrorType} When error occurs
 * @example
 * ```typescript
 * const result = functionName('value');
 * ```
 */
function functionName(paramName: string, optionalParam?: number): ReturnType {
  // implementation
}
```

### Classes

```typescript
/**
 * Brief description of the class
 * @template T - Generic type description
 */
export class ClassName<T> {
  /**
   * @param dependency - Injected dependency
   */
  constructor(private dependency: Dependency) {}
  
  /**
   * Method description
   */
  methodName(): void {
    // implementation
  }
}
```

### Interfaces and Types

```typescript
/**
 * Description of the interface purpose
 */
export interface InterfaceName {
  /** Property description */
  propertyName: string;
  /** Optional property description */
  optionalProperty?: number;
}

/**
 * Type alias description
 */
export type TypeName = string | number;
```

### Constants and Variables

```typescript
/**
 * Description of constant purpose
 */
export const CONSTANT_NAME = 'value';

/**
 * Description of configuration object
 */
export const config = {
  /** API base URL */
  apiUrl: 'http://localhost:5000',
  /** Request timeout in milliseconds */
  timeout: 5000,
};
```

## Inline Comments

### When to Use

**DO use inline comments for**:
- Complex algorithms
- Non-obvious business logic
- Workarounds or hacks
- Performance optimizations
- Security considerations

**DON'T use inline comments for**:
- Obvious code
- Redundant information
- Commented-out code (delete instead)

### Examples

```typescript
// Good: Explains why
// Use exponential backoff to avoid overwhelming the API
await retry(apiCall, { maxAttempts: 3, backoff: 'exponential' });

// Bad: States the obvious
// Increment counter by 1
counter++;

// Good: Explains complex logic
// Calculate business days excluding weekends and holidays
const businessDays = calculateBusinessDays(startDate, endDate, holidays);
```

## File Headers

### Backend Files

```typescript
// backend/src/services/exampleService.ts
/**
 * Example Service
 * 
 * Handles business logic for example domain
 * 
 * @module services/exampleService
 */
```

### Frontend Files

```typescript
// src/components/Example/Example.tsx
/**
 * Example Component
 * 
 * Displays example data with interactive features
 * 
 * @component
 */
```

## Component Documentation

### React Components

```typescript
/**
 * Button component with multiple variants
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button text or content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Custom Hooks

```typescript
/**
 * Hook for managing form state and validation
 * 
 * @param initialValues - Initial form values
 * @param validationSchema - Validation rules
 * @returns Form state and handlers
 * 
 * @example
 * ```typescript
 * const { values, errors, handleChange, handleSubmit } = useForm({
 *   name: '',
 *   email: ''
 * }, validationSchema);
 * ```
 */
export function useForm<T>(
  initialValues: T,
  validationSchema?: ValidationSchema
) {
  // implementation
}
```

## API Documentation

### Route Handlers

```typescript
/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: List all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Patient'
 */
router.get('/', authenticate, async (req, res) => {
  // implementation
});
```

## Complex Logic Documentation

### Algorithm Explanation

```typescript
/**
 * Calculate available time slots for appointments
 * 
 * Algorithm:
 * 1. Get provider's working hours for the date
 * 2. Fetch existing appointments
 * 3. Generate all possible slots (30-min intervals)
 * 4. Filter out occupied slots
 * 5. Filter out past slots
 * 6. Return available slots
 * 
 * @param providerId - Provider ID
 * @param date - Target date
 * @returns Array of available time slots
 */
async function calculateAvailableSlots(
  providerId: string,
  date: Date
): Promise<TimeSlot[]> {
  // Step 1: Get working hours
  const workingHours = await getWorkingHours(providerId, date);
  
  // Step 2: Fetch appointments
  const appointments = await getAppointments(providerId, date);
  
  // Step 3-5: Generate and filter slots
  const slots = generateTimeSlots(workingHours)
    .filter(slot => !isOccupied(slot, appointments))
    .filter(slot => !isPast(slot));
  
  return slots;
}
```

## TODO Comments

### Format

```typescript
// TODO: Description of what needs to be done
// TODO(username): Assigned task
// TODO: [PRIORITY] Description
// FIXME: Description of bug to fix
// HACK: Explanation of workaround
// NOTE: Important information
```

### Examples

```typescript
// TODO: Add input validation
// TODO(john): Implement caching for this query
// TODO: [HIGH] Fix memory leak in event listeners
// FIXME: Race condition when multiple users book simultaneously
// HACK: Temporary fix until API v2 is ready
// NOTE: This function is called from multiple places
```

## Documentation Checklist

### For Every File
- [ ] File header with path
- [ ] Module description
- [ ] Import organization

### For Every Function
- [ ] JSDoc comment
- [ ] Parameter descriptions
- [ ] Return value description
- [ ] Example (for public APIs)

### For Every Class
- [ ] Class description
- [ ] Constructor parameters
- [ ] Public method documentation

### For Every Component
- [ ] Component description
- [ ] Props interface documented
- [ ] Usage example

### For Complex Logic
- [ ] Algorithm explanation
- [ ] Step-by-step breakdown
- [ ] Edge cases noted

## Tools

### Generate Documentation

```bash
# TypeDoc for TypeScript
npx typedoc --out docs/api src/

# JSDoc for JavaScript
npx jsdoc -c jsdoc.json
```

### Lint Documentation

```bash
# ESLint with JSDoc plugin
npm run lint
```

## Best Practices

1. **Write for humans**: Clear, concise, helpful
2. **Keep it updated**: Update docs with code changes
3. **Be consistent**: Follow these standards
4. **Add examples**: Show how to use the code
5. **Explain why**: Not just what, but why
6. **Document edge cases**: Unusual behavior or limitations
7. **Link related code**: Reference related functions/classes

## Anti-Patterns

### Avoid

```typescript
// Bad: Redundant
/**
 * Gets the user
 */
function getUser() {}

// Bad: Outdated
/**
 * Returns user email (WRONG: now returns full user object)
 */
function getUser() {}

// Bad: Too verbose
/**
 * This function takes a string parameter called name
 * and returns a greeting string that says hello to
 * the person whose name was passed in
 */
function greet(name: string): string {}
```

### Prefer

```typescript
// Good: Adds value
/**
 * Fetches user with populated profile data
 * @throws {NotFoundError} If user doesn't exist
 */
function getUser() {}

// Good: Concise and clear
/**
 * Generate personalized greeting
 */
function greet(name: string): string {}
```

## Resources

- [JSDoc Documentation](https://jsdoc.app/)
- [TypeDoc Documentation](https://typedoc.org/)
- [TSDoc Standard](https://tsdoc.org/)
- [Swagger/OpenAPI](https://swagger.io/docs/)
