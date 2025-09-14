// src/pages/Login/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import './ResetPasswordPage.css';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Token de redefinição de senha inválido ou ausente.');
      setLoading(false);
      return;
    }

    try {
      const result = await apiService.auth.resetPassword(token, password);
      if (result.success) {
        setMessage('Sua senha foi redefinida com sucesso! Você já pode fazer login com sua nova senha.');
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
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h1 className="reset-password-title">Redefinir senha</h1>
          <p className="reset-password-subtitle">Digite sua nova senha.</p>
        </div>

        <form className="reset-password-form" onSubmit={handleSubmit}>
          {message && <div className="form-message success">{message}</div>}
          {error && <div className="form-message error">{error}</div>}

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Nova senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Digite a nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar nova senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="form-input"
              placeholder="Confirme a nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
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

export default ResetPasswordPage;
