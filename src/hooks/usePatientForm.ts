import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Patient } from '../../packages/types/src/index';

interface PatientFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';
    cpf: string;
    address: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
    };
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalHistory: {
        allergies: string[];
        medications: string[];
        conditions: string[];
        notes: string;
    };
}

const initialFormData: PatientFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    cpf: '',
    address: {
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
    },
    emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
    },
    medicalHistory: {
        allergies: [],
        medications: [],
        conditions: [],
        notes: ''
    }
};

export const usePatientForm = (patient?: Patient | null, onSave?: (patient: Patient) => void) => {
    const [formData, setFormData] = useState<PatientFormData>(initialFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (patient) {
            setFormData({
                firstName: patient.firstName || '',
                lastName: patient.lastName || '',
                email: patient.email || '',
                phone: patient.phone || '',
                dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
                gender: patient.gender || '',
                cpf: patient.cpf || '',
                address: {
                    street: patient.address?.street || '',
                    number: patient.address?.number || '',
                    neighborhood: patient.address?.neighborhood || '',
                    city: patient.address?.city || '',
                    state: patient.address?.state || '',
                    zipCode: patient.address?.zipCode || ''
                },
                emergencyContact: {
                    name: patient.emergencyContact?.name || '',
                    phone: patient.emergencyContact?.phone || '',
                    relationship: patient.emergencyContact?.relationship || ''
                },
                medicalHistory: {
                    allergies: patient.medicalHistory?.allergies || [],
                    medications: patient.medicalHistory?.medications || [],
                    conditions: patient.medicalHistory?.conditions || [],
                    notes: patient.medicalHistory?.notes || ''
                }
            });
        }
    }, [patient]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [section, field] = name.split('.');
            setFormData(prev => {
                const sectionKey = section as keyof PatientFormData;
                const currentSection = prev[sectionKey];

                if (typeof currentSection === 'object' && currentSection !== null && !Array.isArray(currentSection)) {
                    return {
                        ...prev,
                        [section]: {
                            ...currentSection,
                            [field]: value
                        }
                    };
                }

                return prev;
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleArrayInputChange = useCallback((section: 'allergies' | 'medications' | 'conditions', value: string) => {
        const items = value
            .split(',')
            .map(item => item.trim())
            .filter(item => item);
        setFormData(prev => ({
            ...prev,
            medicalHistory: {
                ...prev.medicalHistory,
                [section]: items
            }
        }));
    }, []);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Nome é obrigatório';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefone é obrigatório';
        } else if (!/^[\d\s\-()+ ]{10,15}$/.test(formData.phone)) {
            newErrors.phone = 'Telefone inválido';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
            newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
        }

        if (!formData.address.zipCode.trim()) {
            newErrors['address.zipCode'] = 'CEP é obrigatório';
        } else if (!/^\d{5}-?\d{3}$/.test(formData.address.zipCode)) {
            newErrors['address.zipCode'] = 'CEP deve estar no formato XXXXX-XXX';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const patientToSave = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                birthDate: formData.dateOfBirth,
                gender: formData.gender === '' || formData.gender === 'prefer_not_to_say' ? undefined : formData.gender,
                cpf: formData.cpf,
                address: formData.address,
                emergencyContact: formData.emergencyContact,
                medicalHistory: formData.medicalHistory
            };

            let result;
            if (patient?._id) {
                result = await apiService.patients.update(patient._id, patientToSave);
            } else {
                result = await apiService.patients.create(patientToSave);
            }

            if (result.success && result.data) {
                onSave?.(result.data);
            } else {
                setErrors({ submit: result.message || 'Erro ao salvar paciente' });
            }
        } catch (error: any) {
            setErrors({ submit: error.message || 'Erro ao salvar paciente' });
        } finally {
            setSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        submitting,
        handleInputChange,
        handleArrayInputChange,
        handleSubmit
    };
};
