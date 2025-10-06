# Accessibility Guidelines

## ARIA Labels

### When to Use

**Always provide ARIA labels for:**
- Buttons without text (icon buttons)
- Form inputs without visible labels
- Interactive elements with unclear purpose
- Dynamic content regions
- Modal dialogs

### Common Patterns

**Buttons**
```tsx
<button aria-label="Fechar">×</button>
<button aria-label="Pesquisar"><SearchIcon /></button>
<button aria-busy={loading}>Salvar</button>
```

**Form Inputs**
```tsx
<input 
  aria-label="Email" 
  aria-required={true}
  aria-invalid={hasError}
  aria-describedby="email-error"
/>
```

**Modals**
```tsx
<div 
  role="dialog" 
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Título</h2>
</div>
```

**Navigation**
```tsx
<nav aria-label="Menu principal">
  <ul role="list">
    <li><a href="/">Home</a></li>
  </ul>
</nav>
```

## ARIA Roles

### Common Roles
- `button` - Interactive button
- `dialog` - Modal dialog
- `navigation` - Navigation section
- `main` - Main content
- `complementary` - Sidebar content
- `search` - Search form
- `alert` - Important message
- `status` - Status update

### Usage
```tsx
<div role="alert">Erro ao salvar</div>
<div role="status" aria-live="polite">Carregando...</div>
<main role="main">Conteúdo principal</main>
```

## ARIA States

### Common States
- `aria-busy` - Loading state
- `aria-disabled` - Disabled state
- `aria-expanded` - Expanded/collapsed
- `aria-hidden` - Hidden from screen readers
- `aria-invalid` - Validation error
- `aria-pressed` - Toggle button state
- `aria-selected` - Selected item

### Usage
```tsx
<button aria-pressed={isActive}>Toggle</button>
<input aria-invalid={hasError} />
<div aria-expanded={isOpen}>Menu</div>
```

## Keyboard Navigation

### Required Support
- Tab: Move forward
- Shift+Tab: Move backward
- Enter/Space: Activate
- Escape: Close/Cancel
- Arrow keys: Navigate lists/menus

### Implementation
```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') onClose();
  if (e.key === 'Enter') onSubmit();
};
```

## Screen Reader Support

### Best Practices
1. Use semantic HTML
2. Provide text alternatives
3. Use ARIA labels appropriately
4. Announce dynamic changes
5. Maintain logical tab order

### Utilities
```tsx
// Screen reader only text
<span className="sr-only">Carregando...</span>

// Skip to main content
<a href="#main" className="skip-link">Pular para conteúdo</a>
```

## Testing

### Manual Testing
1. Navigate with keyboard only
2. Test with screen reader (NVDA, JAWS, VoiceOver)
3. Check color contrast
4. Test with zoom (200%)
5. Verify focus indicators

### Automated Testing
```tsx
import { axe } from 'jest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on icon buttons
- [ ] Form inputs have labels
- [ ] Error messages associated with inputs
- [ ] Modals trap focus
- [ ] Color contrast meets WCAG AA
- [ ] Text resizable to 200%
- [ ] No keyboard traps
- [ ] Screen reader tested
