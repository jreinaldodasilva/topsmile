# Testing Guidelines

## Component Testing

### Test Structure
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('describes expected behavior', () => {
    // Arrange
    render(<Component prop="value" />);
    
    // Act
    fireEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### What to Test

**1. Rendering**
- Component renders without crashing
- Correct content is displayed
- Props are applied correctly

**2. User Interactions**
- Click events
- Form submissions
- Keyboard navigation

**3. State Changes**
- Loading states
- Error states
- Success states

**4. Accessibility**
- ARIA attributes
- Keyboard navigation
- Screen reader support

### Common Patterns

**Testing Props**
```tsx
it('applies variant classes', () => {
  const { rerender } = render(<Button variant="primary">Text</Button>);
  expect(screen.getByRole('button')).toHaveClass('btn--primary');
  
  rerender(<Button variant="secondary">Text</Button>);
  expect(screen.getByRole('button')).toHaveClass('btn--secondary');
});
```

**Testing Events**
```tsx
it('handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Testing Async**
```tsx
it('loads data', async () => {
  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

**Testing Forms**
```tsx
it('handles input changes', () => {
  render(<Input label="Name" />);
  const input = screen.getByLabelText('Name');
  fireEvent.change(input, { target: { value: 'John' } });
  expect(input).toHaveValue('John');
});
```

## Running Tests

```bash
# Run all tests
npm run test:frontend

# Watch mode
npm run test:frontend:watch

# Coverage
npm run test:frontend:coverage

# CI mode
npm run test:frontend:ci
```

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Best Practices

1. Test behavior, not implementation
2. Use semantic queries (getByRole, getByLabelText)
3. Avoid testing internal state
4. Keep tests simple and focused
5. Use descriptive test names
6. Mock external dependencies
7. Clean up after tests
