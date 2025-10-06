# Form Component Guidelines

## Input Component

### Basic Usage
```tsx
import { Input } from './components/common';

<Input 
  label="Email"
  type="email"
  placeholder="Enter your email"
/>
```

### With Error
```tsx
<Input 
  label="Password"
  type="password"
  error="Password is required"
/>
```

### With Helper Text
```tsx
<Input 
  label="Username"
  helperText="Must be 3-20 characters"
/>
```

### Full Width
```tsx
<Input 
  label="Full Name"
  fullWidth
/>
```

## Textarea Component

### Basic Usage
```tsx
import { Textarea } from './components/common';

<Textarea 
  label="Description"
  placeholder="Enter description"
  rows={4}
/>
```

### With Error
```tsx
<Textarea 
  label="Comments"
  error="Comments are required"
/>
```

## Design Tokens

Customize via CSS variables:
```css
:root {
  --input-height-md: 40px;
  --input-padding-x: 12px;
  --input-radius: 6px;
  --input-border-color: #d1d5db;
  --input-border-color-focus: #3b82f6;
  --input-border-color-error: #ef4444;
  --label-font-size: 14px;
  --error-color: #ef4444;
}
```

## Accessibility

- Labels linked to inputs via htmlFor/id
- Error messages with aria-invalid
- Helper text with aria-describedby
- Focus visible styles
- Keyboard navigation support

## Best Practices

1. Always provide labels
2. Use helper text for format guidance
3. Show errors inline
4. Use appropriate input types
5. Provide clear placeholder text
6. Use fullWidth on mobile
