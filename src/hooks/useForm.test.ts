// src/hooks/useForm.test.ts
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';

describe('useForm', () => {
  const initialValues = { email: '', password: '' };

  it('initializes with default values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });

  it('handles input changes', () => {
    const { result } = renderHook(() => useForm(initialValues));
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'test@example.com' } } as any);
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
    const { result } = renderHook(() => useForm(initialValues, { validate, onSubmit }));
    
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });
    
    expect(result.current.errors.email).toBe('Required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit when valid', () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm({ email: 'test@example.com' }, { onSubmit }));
    
    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });
    
    expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('resets form', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'test@example.com' } } as any);
    });
    expect(result.current.values.email).toBe('test@example.com');
    
    act(() => {
      result.current.reset();
    });
    expect(result.current.values).toEqual(initialValues);
  });
});
