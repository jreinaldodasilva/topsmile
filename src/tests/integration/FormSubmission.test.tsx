// src/tests/integration/FormSubmission.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Input, Button } from '../../components/common';
import { useForm } from '../../hooks/useForm';

const LoginForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors: any = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      return errors;
    },
    onSubmit
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        name="email"
        value={values.email}
        onChange={(e: any) => handleChange('email', e.target.value)}
        error={errors.email}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={values.password}
        onChange={(e: any) => handleChange('password', e.target.value)}
        error={errors.password}
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

describe('Form Submission Integration', () => {
  it('validates and submits form', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
