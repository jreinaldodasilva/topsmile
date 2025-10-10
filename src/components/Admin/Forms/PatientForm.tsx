// src/components/Admin/Forms/PatientForm.tsx
import React from 'react';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import type { Patient } from '../../../../packages/types/src/index';
import { usePatientForm } from '../../../hooks/usePatientForm';
import './PatientForm.css';

interface PatientFormProps {
    patient?: Patient | null;
    onSave: (patient: Patient) => void;
    onCancel: () => void;
    loading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onCancel, loading = false }): JSX.Element => {
    const { formData, errors, submitting, handleInputChange, handleArrayInputChange, handleSubmit } = usePatientForm(
        patient,
        onSave
    );

    return (
        <form onSubmit={handleSubmit} className="patient-form">
            {errors.submit && <div className="error-banner">{errors.submit}</div>}

            {/* Basic Information */}
            <div className="form-section">
                <h3>Informações Básicas</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="firstName">Nome *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={errors.firstName ? 'error' : ''}
                            required
                        />
                        {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Sobrenome</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Telefone *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={errors.phone ? 'error' : ''}
                            placeholder="(11) 99999-9999"
                            required
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Data de Nascimento</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gênero</label>
                        <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange}>
                            <option value="">Selecione</option>
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                            <option value="other">Outro</option>
                            <option value="prefer_not_to_say">Prefere não dizer</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleInputChange}
                            className={errors.cpf ? 'error' : ''}
                            placeholder="000.000.000-00"
                        />
                        {errors.cpf && <span className="error-text">{errors.cpf}</span>}
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="form-section">
                <h3>Endereço</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="address.street">Rua</label>
                        <input
                            type="text"
                            id="address.street"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.number">Número</label>
                        <input
                            type="text"
                            id="address.number"
                            name="address.number"
                            value={formData.address.number}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.neighborhood">Bairro</label>
                        <input
                            type="text"
                            id="address.neighborhood"
                            name="address.neighborhood"
                            value={formData.address.neighborhood}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.city">Cidade</label>
                        <input
                            type="text"
                            id="address.city"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.state">Estado</label>
                        <input
                            type="text"
                            id="address.state"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            maxLength={2}
                            placeholder="SP"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.zipCode">CEP</label>
                        <input
                            type="text"
                            id="address.zipCode"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleInputChange}
                            className={errors['address.zipCode'] ? 'error' : ''}
                            placeholder="00000-000"
                        />
                        {errors['address.zipCode'] && <span className="error-text">{errors['address.zipCode']}</span>}
                    </div>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="form-section">
                <h3>Contato de Emergência</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="emergencyContact.name">Nome</label>
                        <input
                            type="text"
                            id="emergencyContact.name"
                            name="emergencyContact.name"
                            value={formData.emergencyContact.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="emergencyContact.phone">Telefone</label>
                        <input
                            type="tel"
                            id="emergencyContact.phone"
                            name="emergencyContact.phone"
                            value={formData.emergencyContact.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="emergencyContact.relationship">Parentesco</label>
                        <input
                            type="text"
                            id="emergencyContact.relationship"
                            name="emergencyContact.relationship"
                            value={formData.emergencyContact.relationship}
                            onChange={handleInputChange}
                            placeholder="Ex: Mãe, Pai, Cônjuge"
                        />
                    </div>
                </div>
            </div>

            {/* Medical History */}
            <div className="form-section">
                <h3>Histórico Médico</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="allergies">Alergias</label>
                        <input
                            type="text"
                            id="allergies"
                            value={formData.medicalHistory.allergies.join(', ')}
                            onChange={e => handleArrayInputChange('allergies', e.target.value)}
                            placeholder="Separe por vírgulas"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="medications">Medicamentos</label>
                        <input
                            type="text"
                            id="medications"
                            value={formData.medicalHistory.medications.join(', ')}
                            onChange={e => handleArrayInputChange('medications', e.target.value)}
                            placeholder="Separe por vírgulas"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="conditions">Condições Médicas</label>
                        <input
                            type="text"
                            id="conditions"
                            value={formData.medicalHistory.conditions.join(', ')}
                            onChange={e => handleArrayInputChange('conditions', e.target.value)}
                            placeholder="Separe por vírgulas"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="medicalHistory.notes">Observações</label>
                        <textarea
                            id="medicalHistory.notes"
                            name="medicalHistory.notes"
                            value={formData.medicalHistory.notes}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Observações adicionais sobre o histórico médico"
                        />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-outline" disabled={submitting}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting || loading}>
                    {submitting ? 'Salvando...' : patient ? 'Atualizar' : 'Criar'} Paciente
                </button>
            </div>
        </form>
    );
};

// Wrap with ErrorBoundary for async operations
const PatientFormWithErrorBoundary: React.FC<PatientFormProps> = (props): JSX.Element => (
    <ErrorBoundary level="component" context="patient-form">
        <PatientForm {...props} />
    </ErrorBoundary>
);

export default PatientFormWithErrorBoundary;
