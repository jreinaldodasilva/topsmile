import React, { useState } from 'react';
import { Input, Button, SimpleSelect } from '../UI';
import type { Insurance } from '@topsmile/types';

interface EnhancedInsuranceFormProps {
    insurance?: Insurance;
    type: 'primary' | 'secondary';
    onSave: (data: Partial<Insurance>) => Promise<void>;
    onCancel: () => void;
}

export const EnhancedInsuranceForm: React.FC<EnhancedInsuranceFormProps> = ({ insurance, type, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        type,
        provider: insurance?.provider || '',
        policyNumber: insurance?.policyNumber || '',
        groupNumber: insurance?.groupNumber || '',
        subscriberName: insurance?.subscriberName || '',
        subscriberRelationship: insurance?.subscriberRelationship || 'self',
        subscriberDOB: insurance?.subscriberDOB ? new Date(insurance.subscriberDOB).toISOString().split('T')[0] : '',
        effectiveDate: insurance?.effectiveDate ? new Date(insurance.effectiveDate).toISOString().split('T')[0] : '',
        expirationDate: insurance?.expirationDate ? new Date(insurance.expirationDate).toISOString().split('T')[0] : '',
        coverageDetails: {
            annualMaximum: insurance?.coverageDetails?.annualMaximum || 0,
            deductible: insurance?.coverageDetails?.deductible || 0,
            deductibleMet: insurance?.coverageDetails?.deductibleMet || 0,
            coinsurance: insurance?.coverageDetails?.coinsurance || 0,
            copay: insurance?.coverageDetails?.copay || 0
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.provider.trim()) newErrors.provider = 'Seguradora é obrigatória';
        if (!formData.policyNumber.trim()) newErrors.policyNumber = 'Número da apólice é obrigatório';
        if (!formData.subscriberName.trim()) newErrors.subscriberName = 'Nome do titular é obrigatório';
        if (!formData.effectiveDate) newErrors.effectiveDate = 'Data de início é obrigatória';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            await onSave(formData as any);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <section>
                <h3>Informações do Seguro {type === 'primary' ? 'Principal' : 'Secundário'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <Input
                        label="Seguradora *"
                        value={formData.provider}
                        onChange={e => setFormData({ ...formData, provider: e.target.value })}
                        error={errors.provider}
                        required
                    />
                    <Input
                        label="Número da Apólice *"
                        value={formData.policyNumber}
                        onChange={e => setFormData({ ...formData, policyNumber: e.target.value })}
                        error={errors.policyNumber}
                        required
                    />
                    <Input
                        label="Número do Grupo"
                        value={formData.groupNumber}
                        onChange={e => setFormData({ ...formData, groupNumber: e.target.value })}
                    />
                </div>
            </section>

            <section>
                <h3>Informações do Titular</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <Input
                        label="Nome do Titular *"
                        value={formData.subscriberName}
                        onChange={e => setFormData({ ...formData, subscriberName: e.target.value })}
                        error={errors.subscriberName}
                        required
                    />
                    <SimpleSelect
                        label="Relacionamento *"
                        value={formData.subscriberRelationship}
                        onChange={e => setFormData({ ...formData, subscriberRelationship: e.target.value as any })}
                    >
                        <option value="self">Próprio</option>
                        <option value="spouse">Cônjuge</option>
                        <option value="child">Filho(a)</option>
                        <option value="other">Outro</option>
                    </SimpleSelect>
                    <Input
                        label="Data de Nascimento do Titular"
                        type="date"
                        value={formData.subscriberDOB}
                        onChange={e => setFormData({ ...formData, subscriberDOB: e.target.value })}
                    />
                </div>
            </section>

            <section>
                <h3>Vigência</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <Input
                        label="Data de Início *"
                        type="date"
                        value={formData.effectiveDate}
                        onChange={e => setFormData({ ...formData, effectiveDate: e.target.value })}
                        error={errors.effectiveDate}
                        required
                    />
                    <Input
                        label="Data de Término"
                        type="date"
                        value={formData.expirationDate}
                        onChange={e => setFormData({ ...formData, expirationDate: e.target.value })}
                    />
                </div>
            </section>

            <section>
                <h3>Detalhes de Cobertura</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <Input
                        label="Máximo Anual (R$)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.coverageDetails.annualMaximum}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                coverageDetails: {
                                    ...formData.coverageDetails,
                                    annualMaximum: parseFloat(e.target.value) || 0
                                }
                            })
                        }
                    />
                    <Input
                        label="Franquia (R$)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.coverageDetails.deductible}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                coverageDetails: {
                                    ...formData.coverageDetails,
                                    deductible: parseFloat(e.target.value) || 0
                                }
                            })
                        }
                    />
                    <Input
                        label="Franquia Utilizada (R$)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.coverageDetails.deductibleMet}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                coverageDetails: {
                                    ...formData.coverageDetails,
                                    deductibleMet: parseFloat(e.target.value) || 0
                                }
                            })
                        }
                    />
                    <Input
                        label="Coparticipação (%)"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.coverageDetails.coinsurance}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                coverageDetails: {
                                    ...formData.coverageDetails,
                                    coinsurance: parseFloat(e.target.value) || 0
                                }
                            })
                        }
                    />
                    <Input
                        label="Copagamento (R$)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.coverageDetails.copay}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                coverageDetails: { ...formData.coverageDetails, copay: parseFloat(e.target.value) || 0 }
                            })
                        }
                    />
                </div>
            </section>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={onCancel} disabled={saving}>
                    Cancelar
                </Button>
                <Button type="submit" loading={saving}>
                    Salvar Seguro
                </Button>
            </div>
        </form>
    );
};
