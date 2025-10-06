# Keyboard Navigation Guide

## Standard Keys

### Navigation
- **Tab**: Move to next focusable element
- **Shift + Tab**: Move to previous focusable element
- **Arrow Keys**: Navigate within components (lists, menus, etc.)
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals, dropdowns, and dialogs

## Component Patterns

### Modal
```tsx
// Escape to close
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);
```

### Dropdown Menu
```tsx
// Arrow keys to navigate, Enter to select
useKeyboardNavigation({
  onArrowDown: () => setSelectedIndex(prev => prev + 1),
  onArrowUp: () => setSelectedIndex(prev => prev - 1),
  onEnter: () => selectItem(selectedIndex),
  onEscape: () => closeMenu()
});
```

### Form
```tsx
// Enter to submit
<form onSubmit={handleSubmit}>
  <input onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
</form>
```

## Custom Hooks

### useKeyboardNavigation
```tsx
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';

useKeyboardNavigation({
  onEscape: () => console.log('Escape pressed'),
  onEnter: () => console.log('Enter pressed'),
  onArrowUp: () => console.log('Arrow up'),
  onArrowDown: () => console.log('Arrow down')
});
```

### useFocusTrap
```tsx
import { useFocusTrap } from './hooks/useFocusTrap';

const Modal = ({ isOpen }) => {
  const focusTrapRef = useFocusTrap(isOpen);
  
  return (
    <div ref={focusTrapRef}>
      {/* Focus trapped within this container */}
    </div>
  );
};
```

## Focus Management

### Auto-focus First Element
```tsx
useEffect(() => {
  if (isOpen) {
    const firstInput = containerRef.current?.querySelector('input');
    firstInput?.focus();
  }
}, [isOpen]);
```

### Return Focus on Close
```tsx
const previousFocus = useRef<HTMLElement | null>(null);

useEffect(() => {
  if (isOpen) {
    previousFocus.current = document.activeElement as HTMLElement;
  } else {
    previousFocus.current?.focus();
  }
}, [isOpen]);
```

## Testing

### Manual Testing
1. Navigate entire page with Tab only
2. Verify all interactive elements reachable
3. Check focus indicators visible
4. Test keyboard shortcuts
5. Verify no keyboard traps

### Automated Testing
```tsx
it('handles keyboard navigation', () => {
  render(<Component />);
  const button = screen.getByRole('button');
  
  fireEvent.keyDown(button, { key: 'Enter' });
  expect(mockHandler).toHaveBeenCalled();
  
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

## Best Practices

1. **Logical Tab Order**: Follow visual flow
2. **Visible Focus**: Always show focus indicators
3. **Skip Links**: Provide skip to main content
4. **No Traps**: Users can always escape
5. **Consistent Shortcuts**: Use standard keys
6. **Document Shortcuts**: Tell users about keyboard support
