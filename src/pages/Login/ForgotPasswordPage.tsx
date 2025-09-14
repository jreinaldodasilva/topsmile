// src/pages/Login/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import './ForgotPasswordPage.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await apiService.auth.forgotPassword(email);
      if (result.success) {
        setMessage('Um e-mail com instruções para redefinir sua senha foi enviado para o seu endereço de e-mail.');
      } else {
        setError(result.message || 'Ocorreu um erro. Tente novamente.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro de rede. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1 className="forgot-password-title">Esqueceu a senha?</h1>
          <p className="forgot-password-subtitle">
            Digite seu e-mail para receber instruções de como redefinir sua senha.
          </p>
        </div>

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          {message && <div className="form-message success">{message}</div>}
          {error && <div className="form-message error">{error}</div>}

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>

          <div className="back-to-login">
            <Link to="/login" className="back-link">
              ← Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
