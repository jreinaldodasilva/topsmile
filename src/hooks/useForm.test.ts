// src/hooks/useForm.test.ts
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';

describe('useForm', () => {
  const initialValues = { email: '', password: '' };

  it('initializes with default values', () => {
    const { result } = renderHook(() => useForm({ initialValues, onSubmit: jest.fn() }));
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });

  it('handles input changes', () => {
    const { result } = renderHook(() => useForm({ initialValues, onSubmit: jest.fn() }));
    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });
    expect(result.current.values.email).toBe('test@example.com');
  });

  it('validates on submit', () => {
    const validate = (values: any) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Required';
      return errors;
    };
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ initialValues, validate, onSubmit }));
    
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });
    
    expect(result.current.errors.email).toBe('Required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit when valid', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ initialValues: { email: 'test@example.com' }, onSubmit }));
    
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });
    
    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('resets form', () => {
    const { result } = renderHook(() => useForm({ initialValues, onSubmit: jest.fn() }));
    
    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });
    expect(result.current.values.email).toBe('test@example.com');
    
    act(() => {
      result.current.resetForm();
    });
    expect(result.current.values).toEqual(initialValues);
  });
});
