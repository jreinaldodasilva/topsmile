// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
    initialValues: T;
    validate?: (values: T) => Record<string, string>;
    onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
    values: T;
    errors: Record<string, string>;
    isSubmitting: boolean;
    handleChange: (name: string, value: any) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setValues: (values: T) => void;
    setErrors: (errors: Record<string, string>) => void;
    resetForm: () => void;
}

export const useForm = <T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit
}: UseFormOptions<T>): UseFormReturn<T> => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((name: string, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [errors]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate if validator provided
        if (validate) {
            const validationErrors = validate(values);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit(values);
        } catch (error: any) {
            // Handle API errors
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ submit: error.message || 'Erro ao enviar formulário' });
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validate, onSubmit]);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setIsSubmitting(false);
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setValues,
        setErrors,
        resetForm
    };
};
