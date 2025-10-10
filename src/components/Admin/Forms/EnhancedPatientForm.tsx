import React, { useState } from 'react';
import { Input, Button } from '../../UI';
import type { Patient, CreatePatientDTO } from '@topsmile/types';

interface EnhancedPatientFormProps {
    patient?: Patient;
    onSave: (data: Partial<Patient>) => Promise<void>;
    onCancel: () => void;
}

export const EnhancedPatientForm: React.FC<EnhancedPatientFormProps> = ({ patient, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: patient?.firstName || '',
        lastName: patient?.lastName || '',
        email: patient?.email || '',
        phone: patient?.phone || '',
        dateOfBirth: patient?.dateOfBirth || '',
        gender: patient?.gender || '',
        cpf: patient?.cpf || '',
        address: {
            street: patient?.address?.street || '',
            number: patient?.address?.number || '',
            neighborhood: patient?.address?.neighborhood || '',
            city: patient?.address?.city || '',
            state: patient?.address?.state || '',
            zipCode: patient?.address?.zipCode || ''
        },
        emergencyContact: {
            name: patient?.emergencyContact?.name || '',
            phone: patient?.emergencyContact?.phone || '',
            relationship: patient?.emergencyContact?.relationship || ''
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName?.trim()) newErrors.firstName = 'Nome é obrigatório';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Sobrenome é obrigatório';
        if (!formData.phone?.trim()) newErrors.phone = 'Telefone é obrigatório';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.address.zipCode?.trim()) newErrors.zipCode = 'CEP é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            await onSave({
                ...formData,
                gender: formData.gender as 'male' | 'female' | 'other'
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section>
                <h3>Informações Pessoais</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <Input
                        label="Nome *"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        error={errors.firstName}
                        required
                    />
                    <Input
                        label="Sobrenome *"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        error={errors.lastName}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email || ''}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                    />
                    <Input
                        label="Telefone *"
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        error={errors.phone}
                        required
                    />
                    <Input
                        label="CPF"
                        value={formData.cpf || ''}
                        onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                    />
                    <Input
                        label="Data de Nascimento"
                        type="date"
                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                        onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                </div>
            </section>

            <section>
                <h3>Endereço</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                    <Input
                        label="Rua"
                        value={formData.address.street || ''}
                        onChange={e =>
                            setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
                        }
                    />
                    <Input
                        label="Número"
                        value={formData.address.number || ''}
                        onChange={e =>
                            setFormData({ ...formData, address: { ...formData.address, number: e.target.value } })
                        }
                    />
                    <Input
                        label="Bairro"
                        value={formData.address.neighborhood || ''}
                        onChange={e =>
                            setFormData({ ...formData, address: { ...formData.address, neighborhood: e.target.value } })
                        }
                    />
                    <Input
                        label="CEP *"
                        value={formData.address.zipCode}
                        onChange={e =>
                            setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })
                        }
                        error={errors.zipCode}
                        placeholder="00000-000"
                        required
                    />
                    <Input
                        label="Cidade"
                        value={formData.address.city || ''}
                        onChange={e =>
                            setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
                        }
                    />
                    <Input
                        label="Estado"
                        value={formData.address.state || ''}
                        onChange={e =>
                            setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })
                        }
                        placeholder="SP"
                    />
                </div>
            </section>

            <section>
                <h3>Contato de Emergência</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <Input
                        label="Nome"
                        value={formData.emergencyContact.name || ''}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                            })
                        }
                    />
                    <Input
                        label="Telefone"
                        type="tel"
                        value={formData.emergencyContact.phone || ''}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                            })
                        }
                    />
                    <Input
                        label="Relacionamento"
                        value={formData.emergencyContact.relationship || ''}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                            })
                        }
                        placeholder="Ex: Cônjuge, Pai, Mãe"
                    />
                </div>
            </section>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={onCancel} disabled={saving}>
                    Cancelar
                </Button>
                <Button type="submit" loading={saving}>
                    {patient ? 'Atualizar' : 'Criar'} Paciente
                </Button>
            </div>
        </form>
    );
};
