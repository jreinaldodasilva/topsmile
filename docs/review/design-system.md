# TopSmile Design System

## Overview

This document defines the standardized UI components and design patterns for the TopSmile application. All developers must use these components to ensure consistency across the platform.

---

## Components

### Button

**Location:** `src/components/UI/Button/Button.tsx`

**Variants:**
- `primary` - Main actions (default)
- `secondary` - Secondary actions
- `danger` - Destructive actions
- `success` - Positive confirmations
- `outline` - Tertiary actions

**Sizes:**
- `sm` - Small (mobile, compact spaces)
- `md` - Medium (default)
- `lg` - Large (prominent actions)

**Props:**
```typescript
interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}
```

**Usage:**
```tsx
import Button from '@/components/UI/Button/Button';

// Primary action
<Button variant="primary" onClick={handleSave}>
    Salvar
</Button>

// Loading state
<Button variant="primary" isLoading>
    Salvando...
</Button>

// Danger action
<Button variant="danger" onClick={handleDelete}>
    Excluir
</Button>

// Full width
<Button variant="primary" fullWidth>
    Continuar
</Button>
```

---

### Modal

**Location:** `src/components/UI/Modal/Modal.tsx`

**Sizes:**
- `sm` - 400px (confirmations, alerts)
- `md` - 600px (default, forms)
- `lg` - 800px (detailed content)
- `xl` - 1000px (complex forms)
- `full` - Full screen (mobile, complex workflows)

**Props:**
```typescript
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    footer?: React.ReactNode;
}
```

**Usage:**
```tsx
import Modal from '@/components/UI/Modal/Modal';
import Button from '@/components/UI/Button/Button';

<Modal
    isOpen={isOpen}
    onClose={handleClose}
    title="Criar Paciente"
    size="md"
    footer={
        <>
            <Button variant="outline" onClick={handleClose}>
                Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
                Salvar
            </Button>
        </>
    }
>
    <PatientForm />
</Modal>
```

---

### Table

**Location:** `src/components/UI/Table/Table.tsx`

**Features:**
- Generic TypeScript support
- Loading states with skeleton
- Empty states
- Row click handlers
- Custom cell rendering

**Props:**
```typescript
interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
    width?: string;
}
```

**Usage:**
```tsx
import Table from '@/components/UI/Table/Table';

const columns = [
    { key: 'name', header: 'Nome', width: '40%' },
    { key: 'email', header: 'E-mail', width: '30%' },
    { 
        key: 'status', 
        header: 'Status',
        render: (patient) => (
            <span className={`badge badge--${patient.status}`}>
                {patient.status}
            </span>
        )
    }
];

<Table
    data={patients}
    columns={columns}
    onRowClick={handleRowClick}
    isLoading={isLoading}
    emptyMessage="Nenhum paciente encontrado"
/>
```

---

### Form Components

**Location:** `src/components/UI/Form/FormComponents.tsx`

**Components:**
- `Form` - Form wrapper
- `FormSection` - Grouped fields with title
- `FormGrid` - Responsive grid layout
- `FormActions` - Action buttons container

**Usage:**
```tsx
import { Form, FormSection, FormGrid, FormActions } from '@/components/UI/Form/FormComponents';
import FormField from '@/components/UI/Form/FormField';
import Button from '@/components/UI/Button/Button';

<Form onSubmit={handleSubmit}>
    <FormSection title="Informações Pessoais">
        <FormGrid columns={2}>
            <FormField label="Nome" name="firstName" required />
            <FormField label="Sobrenome" name="lastName" required />
        </FormGrid>
        <FormGrid columns={1}>
            <FormField label="E-mail" name="email" type="email" />
        </FormGrid>
    </FormSection>
    
    <FormSection title="Contato">
        <FormGrid columns={2}>
            <FormField label="Telefone" name="phone" required />
            <FormField label="CEP" name="zipCode" />
        </FormGrid>
    </FormSection>
    
    <FormActions align="right">
        <Button variant="outline" onClick={onCancel}>
            Cancelar
        </Button>
        <Button variant="primary" type="submit">
            Salvar
        </Button>
    </FormActions>
</Form>
```

---

## Design Tokens

### Colors

**Location:** `src/styles/tokens/buttons.css`, `src/styles/tokens/modals.css`

**Primary:**
- `--button-primary-bg: #007bff`
- `--button-primary-hover: #0056b3`

**Secondary:**
- `--button-secondary-bg: #6c757d`
- `--button-secondary-hover: #545b62`

**Danger:**
- `--button-danger-bg: #dc3545`
- `--button-danger-hover: #c82333`

**Success:**
- `--button-success-bg: #28a745`
- `--button-success-hover: #218838`

### Spacing

- `--modal-padding: 1.5rem`
- `--button-padding-sm: 0.375rem 0.75rem`
- `--button-padding-md: 0.5rem 1rem`
- `--button-padding-lg: 0.75rem 1.5rem`

### Typography

- `--button-font-size-sm: 0.875rem`
- `--button-font-size-md: 1rem`
- `--button-font-size-lg: 1.125rem`

---

## Usage Guidelines

### DO ✅

1. **Always use UI components** from `src/components/UI/`
2. **Use design tokens** for colors, spacing, and typography
3. **Follow naming conventions** (Portuguese for user-facing text)
4. **Include loading states** for async operations
5. **Add empty states** for lists and tables
6. **Use proper ARIA labels** for accessibility

### DON'T ❌

1. **Never create custom buttons** - use Button component
2. **Don't use inline styles** for colors or spacing
3. **Don't create custom modals** - use Modal component
4. **Don't hardcode colors** - use CSS variables
5. **Don't skip loading states**
6. **Don't forget accessibility attributes**

---

## Examples

### Complete Form Example

```tsx
import { Form, FormSection, FormGrid, FormActions } from '@/components/UI/Form/FormComponents';
import FormField from '@/components/UI/Form/FormField';
import Button from '@/components/UI/Button/Button';
import Modal from '@/components/UI/Modal/Modal';

const CreatePatientModal = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Save logic
        setIsLoading(false);
        onClose();
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Criar Novo Paciente"
            size="lg"
        >
            <Form onSubmit={handleSubmit}>
                <FormSection title="Dados Pessoais">
                    <FormGrid columns={2}>
                        <FormField label="Nome" name="firstName" required />
                        <FormField label="Sobrenome" name="lastName" required />
                        <FormField label="CPF" name="cpf" />
                        <FormField label="Data de Nascimento" name="dateOfBirth" type="date" />
                    </FormGrid>
                </FormSection>
                
                <FormSection title="Contato">
                    <FormGrid columns={2}>
                        <FormField label="Telefone" name="phone" required />
                        <FormField label="E-mail" name="email" type="email" />
                    </FormGrid>
                </FormSection>
                
                <FormActions>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" isLoading={isLoading}>
                        Salvar Paciente
                    </Button>
                </FormActions>
            </Form>
        </Modal>
    );
};
```

---

## Migration Guide

### Migrating Existing Components

**Before:**
```tsx
<button className="btn-primary" onClick={handleSave}>
    Salvar
</button>
```

**After:**
```tsx
<Button variant="primary" onClick={handleSave}>
    Salvar
</Button>
```

**Before:**
```tsx
<div className="modal-overlay" onClick={onClose}>
    <div className="modal-content">
        {children}
    </div>
</div>
```

**After:**
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Título">
    {children}
</Modal>
```

---

## Support

For questions or issues with the design system:
1. Check this documentation first
2. Review component source code in `src/components/UI/`
3. Ask in the development team channel

---

**Last Updated:** January 2025  
**Version:** 1.0.0
