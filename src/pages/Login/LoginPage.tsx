import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthState, useAuthActions } from '../../contexts/AuthContext';
import './AuthPage.css';

const LoginPage: React.FC = () => {
  const { loading, error, isAuthenticated } = useAuthState();
  const { login, clearError } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    await login(formData.email, formData.password, rememberMe);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) {
      clearError();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <svg className="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="auth-title">TopSmile Admin</h1>
          <p className="auth-subtitle">Faça login para acessar o painel administrativo</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
               <div className="error-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="error-content">
                <h3 className="error-title">Erro no login</h3>
                <div className="error-message">{error}</div>
              </div>
            </div>
          )}

          <div className="form-fields">
            <div className="form-field">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input id="email" name="email" type="email" required className="form-input" placeholder="seu@email.com" value={formData.email} onChange={handleInputChange} disabled={loading} />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-label">Senha</label>
              <div className="password-field">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required className="form-input" placeholder="Sua senha" value={formData.password} onChange={handleInputChange} disabled={loading} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input id="remember-me" name="remember-me" type="checkbox" className="checkbox-input" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={loading} />
              <label htmlFor="remember-me" className="checkbox-label">Lembrar-me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password-link">Esqueceu a senha?</Link>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="auth-links">
            <p>Ainda não tem uma conta? <Link to="/register" className="auth-link primary">Criar conta</Link></p>
            <p><Link to="/" className="auth-link">← Voltar ao site</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;