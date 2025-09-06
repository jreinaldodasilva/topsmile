// src/components/UI/Form/FormField.tsx
import React from 'react';
import Input, { InputProps } from '../Input/Input';
import './FormField.css';

interface FormFieldProps extends Omit<InputProps, 'error'> {
  name: string;
  label?: string;
  error?: string | boolean;
  touched?: boolean;
  showError?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  error,
  touched,
  showError = true,
  ...props
}) => {
  const shouldShowError = showError && touched && error;
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <Input
      {...props}
      id={name}
      name={name}
      error={shouldShowError ? errorMessage : undefined}
      aria-invalid={shouldShowError ? 'true' : 'false'}
    />
  );
};

// src/components/UI/Form/FormSection.tsx
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`form-section ${className}`}>
      {(title || description) && (
        <div className="form-section__header">
          {title && <h3 className="form-section__title">{title}</h3>}
          {description && <p className="form-section__description">{description}</p>}
        </div>
      )}
      <div className="form-section__content">
        {children}
      </div>
    </div>
  );
};

// src/components/UI/Form/FormGrid.tsx
interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FormGrid: React.FC<FormGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className = ''
}) => {
  const gridClasses = [
    'form-grid',
    `form-grid--columns-${columns}`,
    `form-grid--gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// src/components/UI/Form/FormActions.tsx
interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'space-between';
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  children,
  align = 'right',
  className = ''
}) => {
  const actionsClasses = [
    'form-actions',
    `form-actions--${align}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={actionsClasses}>
      {children}
    </div>
  );
};

// src/components/UI/Form/Select.tsx
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
  success?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  loading = false,
  success = false,
  className = '',
  required,
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;

  const baseClasses = 'select-group';
  const errorClasses = error ? 'select-group--error' : '';
  const successClasses = success && !error ? 'select-group--success' : '';
  const loadingClasses = loading ? 'select-group--loading' : '';

  const groupClasses = [
    baseClasses,
    errorClasses,
    successClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {label && (
        <label htmlFor={selectId} className="select__label">
          {label}
          {required && <span className="select__required">*</span>}
        </label>
      )}
      
      <div className="select__container">
        <select
          id={selectId}
          className="select__field"
          aria-describedby={[
            error ? errorId : null,
            helperText ? helperId : null
          ].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="select__icons">
          {loading && (
            <svg className="select__spinner" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="select__spinner-circle"
              />
            </svg>
          )}
          {success && !error && !loading && (
            <svg className="select__success-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {error && !loading && (
            <svg className="select__error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <svg className="select__chevron" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      
      {error && (
        <p id={errorId} className="select__error" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={helperId} className="select__helper">
          {helperText}
        </p>
      )}
    </div>
  );
};

// src/components/UI/Form/Textarea.tsx
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  loading?: boolean;
  success?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  resize = 'vertical',
  loading = false,
  success = false,
  className = '',
  required,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;

  const baseClasses = 'textarea-group';
  const errorClasses = error ? 'textarea-group--error' : '';
  const successClasses = success && !error ? 'textarea-group--success' : '';
  const loadingClasses = loading ? 'textarea-group--loading' : '';

  const groupClasses = [
    baseClasses,
    errorClasses,
    successClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {label && (
        <label htmlFor={textareaId} className="textarea__label">
          {label}
          {required && <span className="textarea__required">*</span>}
        </label>
      )}
      
      <div className="textarea__container">
        <textarea
          id={textareaId}
          className={`textarea__field textarea__field--resize-${resize}`}
          aria-describedby={[
            error ? errorId : null,
            helperText ? helperId : null
          ].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? 'true' : undefined}
          required={required}
          {...props}
        />
        
        <div className="textarea__icons">
          {loading && (
            <svg className="textarea__spinner" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="textarea__spinner-circle"
              />
            </svg>
          )}
          {success && !error && !loading && (
            <svg className="textarea__success-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {error && !loading && (
            <svg className="textarea__error-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      
      {error && (
        <p id={errorId} className="textarea__error" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={helperId} className="textarea__helper">
          {helperText}
        </p>
      )}
    </div>
  );
};

// src/components/UI/Form/Checkbox.tsx
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  indeterminate = false,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${checkboxId}-error`;

  const baseClasses = 'checkbox-group';
  const errorClasses = error ? 'checkbox-group--error' : '';

  const groupClasses = [
    baseClasses,
    errorClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      <div className="checkbox__container">
        <input
          type="checkbox"
          id={checkboxId}
          className="checkbox__input"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? 'true' : undefined}
          ref={(input) => {
            if (input) input.indeterminate = indeterminate;
          }}
          {...props}
        />
        <div className="checkbox__indicator">
          {indeterminate ? (
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 8h8v1H4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
          )}
        </div>
        {(label || description) && (
          <div className="checkbox__content">
            {label && (
              <label htmlFor={checkboxId} className="checkbox__label">
                {label}
              </label>
            )}
            {description && (
              <p className="checkbox__description">{description}</p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p id={errorId} className="checkbox__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// src/components/UI/Form/RadioGroup.tsx
interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  error?: string;
  helperText?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  defaultValue,
  error,
  helperText,
  orientation = 'vertical',
  onChange,
  className = ''
}) => {
  const groupId = `radio-group-${name}`;
  const helperId = `${groupId}-helper`;
  const errorId = `${groupId}-error`;

  const baseClasses = 'radio-group';
  const orientationClasses = `radio-group--${orientation}`;
  const errorClasses = error ? 'radio-group--error' : '';

  const groupClasses = [
    baseClasses,
    orientationClasses,
    errorClasses,
    className
  ].filter(Boolean).join(' ');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className={groupClasses} role="radiogroup" aria-labelledby={label ? groupId : undefined}>
      {label && (
        <label id={groupId} className="radio-group__label">
          {label}
        </label>
      )}
      
      <div className="radio-group__options">
        {options.map((option) => {
          const radioId = `${name}-${option.value}`;
          return (
            <div key={option.value} className="radio-option">
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                checked={value ? value === option.value : undefined}
                defaultChecked={defaultValue === option.value}
                disabled={option.disabled}
                onChange={handleChange}
                className="radio-option__input"
                aria-describedby={[
                  error ? errorId : null,
                  helperText ? helperId : null
                ].filter(Boolean).join(' ') || undefined}
              />
              <div className="radio-option__indicator"></div>
              <div className="radio-option__content">
                <label htmlFor={radioId} className="radio-option__label">
                  {option.label}
                </label>
                {option.description && (
                  <p className="radio-option__description">{option.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {error && (
        <p id={errorId} className="radio-group__error" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={helperId} className="radio-group__helper">
          {helperText}
        </p>
      )}
    </div>
  );
};

// Export all components
export { FormField, FormSection, FormGrid, FormActions, Select, Textarea, Checkbox, RadioGroup };
export type { FormFieldProps, SelectOption, RadioOption };


// src/components/UI/Form/FormField.css
/* Enhanced Form Components Styles */

/* Form Section */
.form-section {
  margin-bottom: var(--space-8);
}

.form-section__header {
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-primary);
}

.form-section__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2) 0;
  line-height: var(--line-height-tight);
}

.form-section__description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.form-section__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Form Grid */
.form-grid {
  display: grid;
  width: 100%;
}

.form-grid--columns-1 {
  grid-template-columns: 1fr;
}

.form-grid--columns-2 {
  grid-template-columns: repeat(2, 1fr);
}

.form-grid--columns-3 {
  grid-template-columns: repeat(3, 1fr);
}

.form-grid--columns-4 {
  grid-template-columns: repeat(4, 1fr);
}

.form-grid--gap-sm {
  gap: var(--space-4);
}

.form-grid--gap-md {
  gap: var(--space-6);
}

.form-grid--gap-lg {
  gap: var(--space-8);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-primary);
}

.form-actions--left {
  justify-content: flex-start;
}

.form-actions--center {
  justify-content: center;
}

.form-actions--right {
  justify-content: flex-end;
}

.form-actions--space-between {
  justify-content: space-between;
}

/* Select Component */
.select-group {
  position: relative;
  width: 100%;
}

.select__label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  transition: var(--transition-colors);
}

.select__required {
  color: var(--color-error-500);
  margin-left: var(--space-1);
}

.select__container {
  position: relative;
  display: flex;
  align-items: center;
}

.select__field {
  width: 100%;
  height: var(--input-height-md);
  padding: 0 var(--space-10) 0 var(--space-4);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-sans);
  cursor: pointer;
  transition: var(--transition-all);
  outline: none;
  appearance: none;
}

.select__field:focus {
  border-color: var(--color-border-focus);
  box-shadow: var(--focus-ring);
}

.select__field:disabled {
  background-color: var(--color-neutral-100);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.select__icons {
  position: absolute;
  right: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  pointer-events: none;
  z-index: 2;
}

.select__chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-tertiary);
  transition: var(--transition-transform);
}

.select__field:focus + .select__icons .select__chevron {
  transform: rotate(180deg);
}

.select__success-icon {
  color: var(--color-success-500);
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.select__error-icon {
  color: var(--color-error-500);
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.select__spinner {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary-500);
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

.select__spinner-circle {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: spinner-dash 1.5s ease-in-out infinite;
}

.select__helper,
.select__error {
  font-size: var(--font-size-sm);
  margin-top: var(--space-1);
  line-height: var(--line-height-normal);
}

.select__helper {
  color: var(--color-text-tertiary);
}

.select__error {
  color: var(--color-error-600);
  display: flex;
  align-items: flex-start;
  gap: var(--space-1);
}

/* Select States */
.select-group--error .select__field {
  border-color: var(--color-border-error);
}

.select-group--error .select__field:focus {
  box-shadow: var(--focus-ring-error);
}

.select-group--error .select__label {
  color: var(--color-error-600);
}

.select-group--success .select__field {
  border-color: var(--color-success-500);
}

/* Textarea Component */
.textarea-group {
  position: relative;
  width: 100%;
}

.textarea__label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  transition: var(--transition-colors);
}

.textarea__required {
  color: var(--color-error-500);
  margin-left: var(--space-1);
}

.textarea__container {
  position: relative;
  display: flex;
  align-items: flex-start;
}

.textarea__field {
  width: 100%;
  min-height: 6rem;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-sans);
  line-height: var(--line-height-normal);
  transition: var(--transition-all);
  outline: none;
}

.textarea__field--resize-none {
  resize: none;
}

.textarea__field--resize-both {
  resize: both;
}

.textarea__field--resize-horizontal {
  resize: horizontal;
}

.textarea__field--resize-vertical {
  resize: vertical;
}

.textarea__field::placeholder {
  color: var(--color-text-tertiary);
}

.textarea__field:focus {
  border-color: var(--color-border-focus);
  box-shadow: var(--focus-ring);
}

.textarea__field:disabled {
  background-color: var(--color-neutral-100);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
  resize: none;
}

.textarea__icons {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-1);
  pointer-events: none;
  z-index: 2;
}

.textarea__success-icon {
  color: var(--color-success-500);
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.textarea__error-icon {
  color: var(--color-error-500);
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.textarea__spinner {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary-500);
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

.textarea__spinner-circle {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: spinner-dash 1.5s ease-in-out infinite;
}

.textarea__helper,
.textarea__error {
  font-size: var(--font-size-sm);
  margin-top: var(--space-1);
  line-height: var(--line-height-normal);
}

.textarea__helper {
  color: var(--color-text-tertiary);
}

.textarea__error {
  color: var(--color-error-600);
  display: flex;
  align-items: flex-start;
  gap: var(--space-1);
}

/* Textarea States */
.textarea-group--error .textarea__field {
  border-color: var(--color-border-error);
}

.textarea-group--error .textarea__field:focus {
  box-shadow: var(--focus-ring-error);
}

.textarea-group--error .textarea__label {
  color: var(--color-error-600);
}

.textarea-group--success .textarea__field {
  border-color: var(--color-success-500);
}

/* Checkbox Component */
.checkbox-group {
  width: 100%;
}

.checkbox__container {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.checkbox__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox__indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-primary);
  color: transparent;
  transition: var(--transition-all);
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.checkbox__indicator svg {
  width: 0.875rem;
  height: 0.875rem;
  opacity: 0;
  transform: scale(0.8);
  transition: var(--transition-all);
}

.checkbox__input:checked + .checkbox__indicator {
  background-color: var(--color-primary-500);
  border-color: var(--color-primary-500);
  color: var(--color-neutral-0);
}

.checkbox__input:checked + .checkbox__indicator svg {
  opacity: 1;
  transform: scale(1);
}

.checkbox__input:indeterminate + .checkbox__indicator {
  background-color: var(--color-primary-500);
  border-color: var(--color-primary-500);
  color: var(--color-neutral-0);
}

.checkbox__input:indeterminate + .checkbox__indicator svg {
  opacity: 1;
  transform: scale(1);
}

.checkbox__input:focus-visible + .checkbox__indicator {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.checkbox__input:disabled + .checkbox__indicator {
  background-color: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
  cursor: not-allowed;
}

.checkbox__content {
  flex: 1;
  min-width: 0;
}

.checkbox__label {
  display: block;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: var(--line-height-normal);
}

.checkbox__input:disabled ~ .checkbox__content .checkbox__label {
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.checkbox__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-1) 0 0 0;
  line-height: var(--line-height-normal);
}

.checkbox__error {
  font-size: var(--font-size-sm);
  color: var(--color-error-600);
  margin-top: var(--space-2);
  margin-left: calc(1.25rem + var(--space-3));
  line-height: var(--line-height-normal);
}

/* Checkbox States */
.checkbox-group--error .checkbox__indicator {
  border-color: var(--color-error-500);
}

.checkbox-group--error .checkbox__label {
  color: var(--color-error-600);
}

/* Radio Group Component */
.radio-group {
  width: 100%;
}

.radio-group__label {
  display: block;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
}

.radio-group__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.radio-group--horizontal .radio-group__options {
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--space-6);
}

.radio-option {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.radio-option__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-option__indicator {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-full);
  background-color: var(--color-bg-primary);
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 0.125rem;
  position: relative;
  transition: var(--transition-all);
}

.radio-option__indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-500);
  transform: translate(-50%, -50%) scale(0);
  transition: var(--transition-transform);
}

.radio-option__input:checked + .radio-option__indicator {
  border-color: var(--color-primary-500);
}

.radio-option__input:checked + .radio-option__indicator::after {
  transform: translate(-50%, -50%) scale(1);
}

.radio-option__input:focus-visible + .radio-option__indicator {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.radio-option__input:disabled + .radio-option__indicator {
  background-color: var(--color-neutral-100);
  border-color: var(--color-neutral-300);
  cursor: not-allowed;
}

.radio-option__input:disabled + .radio-option__indicator::after {
  background-color: var(--color-neutral-400);
}

.radio-option__content {
  flex: 1;
  min-width: 0;
}

.radio-option__label {
  display: block;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  line-height: var(--line-height-normal);
}

.radio-option__input:disabled ~ .radio-option__content .radio-option__label {
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}

.radio-option__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-1) 0 0 0;
  line-height: var(--line-height-normal);
}

.radio-group__helper,
.radio-group__error {
  font-size: var(--font-size-sm);
  margin-top: var(--space-3);
  line-height: var(--line-height-normal);
}

.radio-group__helper {
  color: var(--color-text-tertiary);
}

.radio-group__error {
  color: var(--color-error-600);
}

/* Radio Group States */
.radio-group--error .radio-group__label {
  color: var(--color-error-600);
}

.radio-group--error .radio-option__indicator {
  border-color: var(--color-error-500);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-grid--columns-2,
  .form-grid--columns-3,
  .form-grid--columns-4 {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions--space-between {
    flex-direction: column-reverse;
  }
  
  .radio-group--horizontal .radio-group__options {
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .checkbox__error {
    margin-left: 0;
    margin-top: var(--space-3);
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .select__field,
  .textarea__field {
    background-color: var(--color-neutral-800);
    border-color: var(--color-neutral-700);
    color: var(--color-neutral-100);
  }
  
  .select__field:focus,
  .textarea__field:focus {
    background-color: var(--color-neutral-700);
  }
  
  .select__field:disabled,
  .textarea__field:disabled {
    background-color: var(--color-neutral-900);
    color: var(--color-neutral-600);
  }
  
  .checkbox__indicator,
  .radio-option__indicator {
    background-color: var(--color-neutral-800);
    border-color: var(--color-neutral-600);
  }
  
  .checkbox__input:disabled + .checkbox__indicator,
  .radio-option__input:disabled + .radio-option__indicator {
    background-color: var(--color-neutral-900);
    border-color: var(--color-neutral-700);
  }
  
  .form-section__header {
    border-bottom-color: var(--color-neutral-700);
  }
  
  .form-actions {
    border-top-color: var(--color-neutral-700);
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .select__field,
  .textarea__field {
    border-width: 2px;
  }
  
  .select__field:focus,
  .textarea__field:focus {
    border-width: 3px;
  }
  
  .checkbox__indicator,
  .radio-option__indicator {
    border-width: 3px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .select__field,
  .textarea__field,
  .checkbox__indicator,
  .radio-option__indicator,
  .select__chevron {
    transition: none;
  }
  
  .checkbox__indicator svg,
  .radio-option__indicator::after {
    transition: none;
  }
  
  .select__spinner,
  .textarea__spinner {
    animation: none;
  }
  
  .select__spinner-circle,
  .textarea__spinner-circle {
    animation: none;
    stroke-dasharray: none;
    stroke-dashoffset: 0;
  }
}

/* Animation Keyframes */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spinner-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}