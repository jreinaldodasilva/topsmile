# TopSmile Coding Standards

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## General Principles

1. **Write code for humans first, machines second**
2. **Favor readability over cleverness**
3. **Keep functions small and focused**
4. **Use meaningful names**
5. **Follow DRY (Don't Repeat Yourself)**
6. **Write tests for new features**

---

## Naming Conventions

### Variables & Functions
```typescript
// camelCase
const appointmentType = 'consultation';
function getAvailableSlots() { }
```

### Types & Interfaces & Classes
```typescript
// PascalCase
interface IAppointment { }
type AppointmentStatus = 'scheduled' | 'confirmed';
class SchedulingService { }
```

### Constants
```typescript
// UPPER_SNAKE_CASE
const MAX_APPOINTMENTS_PER_DAY = 20;
const DEFAULT_DURATION = 30;
```

### Private Methods
```typescript
class Service {
  private _calculateTotal() { } // underscore prefix
  private parseData() { }       // or just private keyword
}
```

### Boolean Variables
```typescript
// Use descriptive prefixes
const isActive = true;
const hasPermission = false;
const shouldValidate = true;
const canEdit = false;
```

---

## File Organization

### File Naming
```
// Components: PascalCase
AppointmentCard.tsx
PatientList.tsx

// Services: camelCase
appointmentService.ts
authService.ts

// Utilities: camelCase
dateUtils.ts
validators.ts

// Types: camelCase
appointment.types.ts
user.types.ts
```

### Import Order
```typescript
// 1. External packages
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal modules
import { appointmentService } from '@/services';
import { useAuth } from '@/hooks';

// 3. Types
import type { Appointment } from '@topsmile/types';

// 4. Relative imports
import { AppointmentCard } from './AppointmentCard';
import styles from './styles.module.css';
```

---

## TypeScript Standards

### Explicit Types
```typescript
// Good
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Avoid
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Avoid `any`
```typescript
// Bad
function processData(data: any) { }

// Good
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // Type guard
  }
}

// Better
interface ProcessData {
  id: string;
  value: number;
}
function processData(data: ProcessData) { }
```

### Use Type Guards
```typescript
function isAppointment(obj: unknown): obj is Appointment {
  return typeof obj === 'object' && obj !== null && 'scheduledStart' in obj;
}
```

---

## Code Structure

### Function Length
```typescript
// Keep functions under 50 lines
// If longer, extract helper functions

// Good
function createAppointment(data: CreateAppointmentDto) {
  validateAppointmentData(data);
  const appointment = buildAppointment(data);
  return saveAppointment(appointment);
}

// Bad - too long
function createAppointment(data: CreateAppointmentDto) {
  // 100+ lines of code
}
```

### Single Responsibility
```typescript
// Good - each function does one thing
function validateEmail(email: string): boolean { }
function sendEmail(to: string, subject: string): Promise<void> { }

// Bad - function does too much
function validateAndSendEmail(email: string, subject: string) {
  // validates AND sends
}
```

---

## React Patterns

### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';

// 2. Types
interface Props {
  appointment: Appointment;
  onEdit: (id: string) => void;
}

// 3. Component
const AppointmentCard: React.FC<Props> = ({ appointment, onEdit }) => {
  // 4. Hooks
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 5. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 6. Handlers
  const handleEdit = () => {
    onEdit(appointment.id);
  };
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. Export
export default AppointmentCard;
```

### Hooks Rules
```typescript
// Always at top level
function Component() {
  const [state, setState] = useState(0); // ✓
  
  if (condition) {
    const [other, setOther] = useState(0); // ✗ Wrong
  }
}

// Custom hooks start with 'use'
function useAppointments() { }
function useAuth() { }
```

---

## Backend Patterns

### Route Structure
```typescript
// 1. Imports
import express from 'express';
import { authenticate, authorize } from '@/middleware';

// 2. Router
const router = express.Router();

// 3. Middleware
router.use(authenticate);

// 4. Validation
const createValidation = [
  body('name').trim().isLength({ min: 2 }),
];

// 5. Routes
router.post('/', authorize('admin'), createValidation, handler);

// 6. Export
export default router;
```

### Service Pattern
```typescript
class AppointmentService {
  // Public methods
  async createAppointment(data: CreateAppointmentDto): Promise<Result<Appointment>> {
    return this._performCreate(data);
  }
  
  // Private helpers
  private async _performCreate(data: CreateAppointmentDto) {
    // implementation
  }
}
```

---

## Error Handling

### Frontend
```typescript
try {
  await appointmentService.create(data);
} catch (error) {
  if (error instanceof ValidationError) {
    setFieldErrors(error.fields);
  } else if (error instanceof NetworkError) {
    showRetryDialog();
  } else {
    showGenericError('Erro ao criar agendamento');
  }
}
```

### Backend
```typescript
async createAppointment(data: CreateAppointmentDto): Promise<Result<Appointment>> {
  try {
    const appointment = await Appointment.create(data);
    return { success: true, data: appointment };
  } catch (error) {
    logger.error('Failed to create appointment', { error, data });
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}
```

---

## Comments

### When to Comment
```typescript
// Good - explains WHY
// Using exponential backoff to avoid overwhelming the API
await retryWithBackoff(apiCall);

// Bad - explains WHAT (code is self-explanatory)
// Increment counter by 1
counter++;
```

### JSDoc for Public APIs
```typescript
/**
 * Creates a new appointment
 * @param data - Appointment data
 * @returns Promise resolving to created appointment
 * @throws {ValidationError} If data is invalid
 */
async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
  // implementation
}
```

---

## Testing Standards

### Test Structure
```typescript
describe('AppointmentService', () => {
  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      // Arrange
      const data = { ... };
      
      // Act
      const result = await service.createAppointment(data);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('id');
    });
    
    it('should return error for invalid data', async () => {
      // Test error case
    });
  });
});
```

### Test Naming
```typescript
// Pattern: should [expected behavior] when [condition]
it('should return 401 when token is invalid', () => { });
it('should create appointment when data is valid', () => { });
```

---

## Git Commit Messages

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```
feat(appointments): add recurring appointment support

fix(auth): resolve token refresh race condition

docs(api): update authentication endpoints

refactor(services): extract common validation logic
```

---

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] Functions are small and focused
- [ ] Types are explicit (no `any`)
- [ ] Error handling is present
- [ ] Tests are included
- [ ] Comments explain WHY, not WHAT
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] User-facing messages in Portuguese
- [ ] Security best practices followed

---

## Linting Configuration

### ESLint Rules
```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

---

## Improvement Recommendations

### 🟧 High Priority
1. **Add Prettier Configuration** - Consistent formatting (1 day)
2. **Implement Pre-commit Hooks** - Husky + lint-staged (1 day)
3. **Add EditorConfig** - Cross-editor consistency (1 hour)

---

**Related:** [13-Developer-Onboarding-Guide.md](./13-Developer-Onboarding-Guide.md), [15-Testing-Guide.md](./15-Testing-Guide.md)
