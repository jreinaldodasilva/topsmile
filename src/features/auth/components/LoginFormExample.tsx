// src/features/auth/components/LoginFormExample.tsx
import React from 'react';
import { FormBuilder, FieldConfig } from '../../../components/common';
import { useForm } from '../../../hooks';

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginFormExample: React.FC = () => {
    const fields: FieldConfig[] = [
        {
            name: 'email',
            label: 'E-mail',
            type: 'email',
            placeholder: 'seu@email.com',
            required: true
        },
        {
            name: 'password',
            label: 'Senha',
            type: 'password',
            placeholder: '••••••••',
            required: true
        }
    ];

    const validate = (values: LoginFormValues) => {
        const errors: Record<string, string> = {};

        if (!values.email) {
            errors.email = 'E-mail é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = 'E-mail inválido';
        }

        if (!values.password) {
            errors.password = 'Senha é obrigatória';
        } else if (values.password.length < 6) {
            errors.password = 'Senha deve ter no mínimo 6 caracteres';
        }

        return errors;
    };

    const handleSubmit = async (values: LoginFormValues) => {
        // API call would go here
        console.log('Login:', values);
    };

    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit: onSubmit
    } = useForm({
        initialValues: { email: '', password: '' },
        validate,
        onSubmit: handleSubmit
    });

    return (
        <FormBuilder
            fields={fields}
            values={values}
            errors={errors}
            onChange={handleChange}
            onSubmit={onSubmit}
            submitLabel="Entrar"
            isSubmitting={isSubmitting}
        />
    );
};

export default LoginFormExample;
