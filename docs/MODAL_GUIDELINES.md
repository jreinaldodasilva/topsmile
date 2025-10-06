# Modal Component Guidelines

## Basic Usage

```tsx
import { Modal, Button } from './components/common';
import { useState } from 'react';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
};
```

## With Footer

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

## Sizes

```tsx
<Modal size="sm" isOpen={isOpen} onClose={onClose}>
  Small modal (400px)
</Modal>

<Modal size="md" isOpen={isOpen} onClose={onClose}>
  Medium modal (600px)
</Modal>

<Modal size="lg" isOpen={isOpen} onClose={onClose}>
  Large modal (800px)
</Modal>
```

## Prevent Close on Overlay Click

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  closeOnOverlayClick={false}
>
  <p>Must use close button or Escape key</p>
</Modal>
```

## Design Tokens

Customize via CSS variables:
```css
:root {
  --modal-overlay-bg: rgba(0, 0, 0, 0.5);
  --modal-bg: white;
  --modal-radius: 12px;
  --modal-padding: 24px;
  --modal-max-width-md: 600px;
  --modal-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --modal-z-index: 1000;
}
```

## Features

- **Overlay click to close** (configurable)
- **Escape key to close**
- **Body scroll lock** when open
- **Animations** (fade in, slide up)
- **Responsive** (full screen on mobile)
- **Accessible** (role="dialog", aria-modal)

## Accessibility

- Role="dialog" and aria-modal="true"
- Escape key closes modal
- Focus trap (recommended to add)
- Close button with aria-label
- Body scroll locked when open

## Best Practices

1. Always provide a way to close
2. Use appropriate size for content
3. Keep content focused and concise
4. Use footer for actions
5. Provide clear title
6. Consider mobile experience
