// src/tests/components/UI/Form/FormValidation.test.tsx
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '../../../../components/UI/Form/FormField';

const TestForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        name: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const validateField = (name: string, value: string) => {
        let error = '';

        switch (name) {
            case 'email':
                if (!value) error = 'Email é obrigatório';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email inválido';
                break;
            case 'phone':
                if (!value) error = 'Telefone é obrigatório';
                else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) error = 'Formato: (11) 99999-9999';
                break;
            case 'name':
                if (!value) error = 'Nome é obrigatório';
                else if (value.length < 2) error = 'Nome deve ter pelo menos 2 caracteres';
                break;
        }

        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    return (
        <form>
            <FormField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
            />
            <FormField
                name="phone"
                label="Telefone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                touched={touched.phone}
            />
            <FormField
                name="name"
                label="Nome"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
            />
        </form>
    );
};

describe('Form Validation Real-time', () => {
    it('should validate email in real-time', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        const emailInput = screen.getByLabelText('Email');

        // Type invalid email
        await user.type(emailInput, 'invalid-email');

        await waitFor(() => {
            expect(screen.getByText('Email inválido')).toBeInTheDocument();
        });

        // Clear and type valid email
        await user.clear(emailInput);
        await user.type(emailInput, 'valid@email.com');

        await waitFor(() => {
            expect(screen.queryByText('Email inválido')).not.toBeInTheDocument();
        });
    });

    it('should validate phone format in real-time', async () => {
        const user = userEvent.setup();
        render(<TestForm />);

        const phoneInput = screen.getByLabelText('Telefone');

        // Type invalid phone
        await user.type(phoneInput, '123456789');

        await waitFor(() => {
            expect(screen.getByText('Formato: (11) 99999-9999')).toBeInTheDocument();
        });

        // Clear and type valid phone
        await user.clear(phoneInput);
        await user.type(phoneInput, '(11) 99999-9999');

        await waitFor(() => {
            expect(screen.queryByText('Formato: (11) 99999-9999')).not.toBeInTheDocument();
        });
    });

    it('should only show errors after field is touched', async () => {
        render(<TestForm />);

        const nameInput = screen.getByLabelText('Nome');

        // Error should not be visible initially
        expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument();

        // Focus and blur without entering data
        fireEvent.focus(nameInput);
        fireEvent.blur(nameInput);

        // Now error should be visible
        await waitFor(() => {
            expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
        });
    });
});
