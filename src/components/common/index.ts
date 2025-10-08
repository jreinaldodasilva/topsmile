// src/components/common/index.ts
// Re-export UI components for backward compatibility
export { default as Button } from '../UI/Button/Button';
export { default as Input } from '../UI/Input/Input';
export { default as Modal } from '../UI/Modal/Modal';
export { default as Loading } from '../UI/Loading/Loading';

// Common-specific components
export { default as FormField } from './FormField/FormField';
export { default as FormBuilder } from './FormBuilder/FormBuilder';
export { default as Textarea } from './Textarea/Textarea';
export { Dropdown } from './Dropdown/Dropdown';
export { ErrorMessage } from './ErrorMessage/ErrorMessage';
export { LazyWrapper } from './LazyWrapper';
export { LazyImage } from './LazyImage';
export type { FieldConfig } from './FormBuilder/FormBuilder';
