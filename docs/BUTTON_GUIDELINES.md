# Button Component Guidelines

## Usage

```tsx
import Button from './components/common/Button/Button';

<Button variant="primary" size="md">Click Me</Button>
```

## Variants

### Primary
Default action button
```tsx
<Button variant="primary">Save</Button>
```

### Secondary
Less prominent actions
```tsx
<Button variant="secondary">Cancel</Button>
```

### Outline
Alternative style
```tsx
<Button variant="outline">Learn More</Button>
```

### Ghost
Minimal style
```tsx
<Button variant="ghost">Skip</Button>
```

### Destructive
Dangerous actions
```tsx
<Button variant="destructive">Delete</Button>
```

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

## States

### Loading
```tsx
<Button loading>Processing...</Button>
```

### Disabled
```tsx
<Button disabled>Unavailable</Button>
```

### Full Width
```tsx
<Button fullWidth>Submit</Button>
```

## Design Tokens

Customize via CSS variables:
```css
:root {
  --button-height-md: 40px;
  --button-padding-x-md: 16px;
  --button-radius: 8px;
  --button-font-md: 16px;
  --button-font-weight: 500;
}
```

## Accessibility

- Minimum touch target: 44px
- Focus visible styles
- ARIA busy state when loading
- Keyboard navigation support
- Reduced motion support

## Best Practices

1. Use primary for main actions
2. Use destructive for delete/remove
3. Provide loading state for async actions
4. Keep button text concise
5. Use full width on mobile when appropriate
