// src/components/common/Textarea/Textarea.tsx
import React from 'react';
import './Textarea.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const classes = [
    'textarea',
    error && 'textarea--error',
    fullWidth && 'textarea--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`textarea-wrapper ${fullWidth ? 'textarea-wrapper--full-width' : ''}`}>
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={classes}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
        aria-required={props.required}
        aria-label={!label ? props.placeholder || 'Textarea field' : undefined}
        {...props}
      />
      {error && (
        <span id={`${textareaId}-error`} className="textarea-error">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${textareaId}-helper`} className="textarea-helper">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Textarea;
