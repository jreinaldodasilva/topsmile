import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import './PatientRegisterPage.css';
import type { Patient } from '@topsmile/types';

interface Clinic {
    _id: string;
    name: string;
    address: {
        city: string;
        state: string;
    };
}

const PatientRegisterPage: React.FC = () => {
    const { register, loading, error, clearError } = usePatientAuth();
    const navigate = useNavigate();
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loadingClinics, setLoadingClinics] = useState(true);

    const [formData, setFormData] = useState({
        patientId: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        clinicId: ''
    });

    // Fetch clinics on mount
    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await fetch('/api/public/clinics');
                const data = await response.json();
                if (data.success) {
                    setClinics(data.data);
                }
            } catch (err) {
                console.error('Error fetching clinics:', err);
            } finally {
                setLoadingClinics(false);
            }
        };
        fetchClinics();
    }, []);

    // Clear errors when component mounts
    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (error) {
            clearError();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        try {
            if (!formData.clinicId) {
                alert('Por favor, selecione uma clínica.');
                return;
            }

            const result = await register({
                patientId: formData.patientId || undefined,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                clinicId: formData.clinicId
            });

            if (result.success) {
                navigate('/patient/login', {
                    state: { message: 'Conta criada! Verifique seu e-mail para ativar a conta.' }
                });
            }
        } catch (err: any) {
            console.error('Patient registration error:', err);
        }
    };

    return (
        <div className="patient-register-page">
            <div className="patient-register-container">
                <h1>Registrar Conta de Paciente</h1>
                <form className="patient-register-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <label htmlFor="clinicId">Clínica *</label>
                    <select
                        id="clinicId"
                        name="clinicId"
                        required
                        value={formData.clinicId}
                        onChange={e => handleInputChange(e as any)}
                        disabled={loading || loadingClinics}
                    >
                        <option value="">Selecione uma clínica</option>
                        {clinics.map(clinic => (
                            <option key={clinic._id} value={clinic._id}>
                                {clinic.name} - {clinic.address.city}/{clinic.address.state}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="patientId">ID do Paciente (Opcional)</label>
                    <input
                        id="patientId"
                        name="patientId"
                        type="text"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="Digite seu ID de paciente se já possui"
                    />

                    <label htmlFor="name">Nome Completo *</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="Seu nome completo"
                    />

                    <label htmlFor="phone">Telefone *</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="(11) 99999-9999"
                    />

                    <label htmlFor="email">E-mail *</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="seu@email.com"
                    />

                    <label htmlFor="password">Senha *</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="Sua senha (mínimo 8 caracteres)"
                    />

                    <label htmlFor="confirmPassword">Confirmar Senha *</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                        placeholder="Confirme sua senha"
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>

                <p>
                    Já tem uma conta? <Link to="/patient/login">Entrar</Link>
                </p>
            </div>
        </div>
    );
};

export default PatientRegisterPage;
