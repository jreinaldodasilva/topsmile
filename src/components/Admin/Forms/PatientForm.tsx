import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/apiService';
import type { Patient } from '../../../types/api'; // Assuming Patient type is defined here
import './PatientForm.css';

interface PatientFormProps {
  patient?: Patient | null;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
  loading?: boolean;
}

// FIX: Aligned gender type with the backend model, removing `""` and allowing `undefined`.
interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | undefined;
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

const initialState: PatientFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: undefined, // FIX: Use `undefined` as the initial value for gender
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

const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PatientFormData>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        email: patient.email || '',
        phone: patient.phone || '',
        // Format date for the input type="date"
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || undefined,
        cpf: patient.cpf || '',
        // FIX: Safely spread nested objects to prevent errors and ensure all fields are present
        address: { ...initialState.address, ...(patient.address || {}) },
        emergencyContact: { ...initialState.emergencyContact, ...(patient.emergencyContact || {}) },
        medicalHistory: { ...initialState.medicalHistory, ...(patient.medicalHistory || {}) },
      });
    } else {
      // Reset form if no patient is provided
      setFormData(initialState);
    }
  }, [patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clear the specific error when the user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle nested state changes
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          // The key assertion is safe here as we know the structure
          ...(prev[parent as keyof PatientFormData] as object),
          [child]: value,
        },
      }));
    } else {
      // FIX: Convert empty string from select back to `undefined` for gender
      if (name === 'gender') {
        setFormData(prev => ({
          ...prev,
          gender: value === '' ? undefined : (value as PatientFormData['gender']),
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const validate = (): boolean => {
    // Validation logic would go here...
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // The formData is now compatible with the Patient type, no transformation needed before sending
    const patientData = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
    };

    try {
      const result = patient?._id
        ? await apiService.patients.update(patient._id, patientData)
        : await apiService.patients.create(patientData);

      if (result.success && result.data) {
        onSave(result.data);
      } else {
        setErrors({ submit: result.message || 'Failed to save patient.' });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      {/* Basic Info Section */}
      <div className="form-section">
        <h3>Informações Pessoais</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">Nome *</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Sobrenome *</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefone *</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Data de Nascimento *</label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gênero</label>
            <select
              id="gender"
              name="gender"
              // FIX: Coerce undefined to '' for the DOM value, but the state remains clean
              value={formData.gender || ''}
              onChange={handleInputChange}
            >
              <option value="">Selecione...</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
              <option value="prefer_not_to_say">Prefiro não dizer</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF *</label>
            <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} required />
          </div>
        </div>
      </div>

      {/* Other form sections like address, emergencyContact, etc. would go here */}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-outline" disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={submitting || loading}>
          {submitting ? 'Salvando...' : 'Salvar Paciente'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;