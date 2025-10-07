import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthState, useAuthActions } from '../../contexts/AuthContext';
import { RegisterFormData } from '../../../packages/types/src/index';
import PasswordStrengthIndicator from '../../components/Auth/PasswordStrengthIndicator';
import './AuthPage.css';

const RegisterPage: React.FC = () => {
  const { loading, error, isAuthenticated } = useAuthState();
  const { register, clearError } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    clinic: {
      name: '',
      phone: '',
      address: {
        street: '',
        number: '',
        city: '',
        state: '',
        zipCode: ''
      }
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (formData.password !== formData.confirmPassword) {
        // This should be handled more gracefully in a real app
        alert("Passwords do not match");
        return;
    }
    await register(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('clinic.address.')) {
        const addressField = name.split('.')[2];
        setFormData(prev => ({
          ...prev,
          clinic: {
            ...prev.clinic,
            address: { ...prev.clinic.address, [addressField]: value }
          }
        }));
    } else if (name.startsWith('clinic.')) {
        const clinicField = name.split('.')[1];
        setFormData(prev => ({ ...prev, clinic: { ...prev.clinic, [clinicField]: value } }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) {
      clearError();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: '600px' }}>
        <div className="auth-header">
          <div className="auth-logo">
             <svg className="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="auth-title">Criar Conta TopSmile</h1>
          <p className="auth-subtitle">Cadastre sua clínica e comece a usar o TopSmile</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
                <div className="error-icon">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                </div>
                <div className="error-content">
                    <h3 className="error-title">Erro no cadastro</h3>
                    <div className="error-message">{error}</div>
                </div>
            </div>
          )}

          <fieldset className="form-fieldset">
            <legend className="form-legend">Informações Pessoais</legend>
            <div className="form-fields">
              <div className="form-field">
                <label htmlFor="name" className="form-label">Nome Completo</label>
                <input id="name" name="name" type="text" required className="form-input" value={formData.name} onChange={handleInputChange} disabled={loading} />
              </div>
              <div className="form-field">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input id="email" name="email" type="email" required className="form-input" value={formData.email} onChange={handleInputChange} disabled={loading} />
              </div>
              <div className="form-field">
                <label htmlFor="password" className="form-label">Senha</label>
                <div className="password-field">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} required className="form-input" value={formData.password} onChange={handleInputChange} disabled={loading} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={loading}>{showPassword ? 'Ocultar' : 'Mostrar'}</button>
                </div>
                <PasswordStrengthIndicator password={formData.password} />
              </div>
              <div className="form-field">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required className="form-input" value={formData.confirmPassword} onChange={handleInputChange} disabled={loading} />
              </div>
            </div>
          </fieldset>

          <fieldset className="form-fieldset">
            <legend className="form-legend">Informações da Clínica</legend>
            <div className="form-fields">
                <div className="form-field">
                    <label htmlFor="clinic.name" className="form-label">Nome da Clínica</label>
                    <input id="clinic.name" name="clinic.name" type="text" required className="form-input" value={formData.clinic.name} onChange={handleInputChange} disabled={loading} />
                </div>
                <div className="form-field">
                    <label htmlFor="clinic.phone" className="form-label">Telefone</label>
                    <input id="clinic.phone" name="clinic.phone" type="tel" required className="form-input" value={formData.clinic.phone} onChange={handleInputChange} disabled={loading} />
                </div>
                <div className="form-field">
                    <label htmlFor="clinic.address.street" className="form-label">Rua</label>
                    <input id="clinic.address.street" name="clinic.address.street" type="text" className="form-input" value={formData.clinic.address.street} onChange={handleInputChange} disabled={loading} />
                </div>
                <div className="form-field">
                    <label htmlFor="clinic.address.number" className="form-label">Número</label>
                    <input id="clinic.address.number" name="clinic.address.number" type="text" className="form-input" value={formData.clinic.address.number} onChange={handleInputChange} disabled={loading} />
                </div>
                <div className="form-field">
                    <label htmlFor="clinic.address.city" className="form-label">Cidade</label>
                    <input id="clinic.address.city" name="clinic.address.city" type="text" className="form-input" value={formData.clinic.address.city} onChange={handleInputChange} disabled={loading} />
                </div>
                <div className="form-field">
                    <label htmlFor="clinic.address.state" className="form-label">Estado (UF)</label>
                    <input id="clinic.address.state" name="clinic.address.state" type="text" maxLength={2} className="form-input" value={formData.clinic.address.state} onChange={handleInputChange} disabled={loading} />
                </div>
                <div className="form-field">
                    <label htmlFor="clinic.address.zipCode" className="form-label">CEP</label>
                    <input id="clinic.address.zipCode" name="clinic.address.zipCode" type="text" placeholder="00000-000" className="form-input" value={formData.clinic.address.zipCode} onChange={handleInputChange} disabled={loading} />
                </div>
            </div>
          </fieldset>

          <div className="form-options">
            <div className="remember-me">
              <input id="terms-accepted" name="terms-accepted" type="checkbox" className="checkbox-input" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
              <label htmlFor="terms-accepted" className="checkbox-label">Eu aceito os <a href="/terms" target="_blank" className="auth-link primary">Termos de Serviço</a></label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading || !termsAccepted} className="auth-button">
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </div>

          <div className="auth-links">
            <p>Já tem uma conta? <Link to="/login" className="auth-link primary">Fazer login</Link></p>
            <p><Link to="/" className="auth-link">← Voltar ao site</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
