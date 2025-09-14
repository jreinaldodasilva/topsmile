// src/components/Auth/PasswordStrengthIndicator.tsx
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabels = ['Muito Fraca', 'Fraca', 'Razoável', 'Forte', 'Muito Forte'];
  const strengthColors = ['#ef4444', '#f97316', '#facc15', '#a3e635', '#4ade80'];

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(5, 1fr)`, gap: '0.25rem', height: '0.5rem' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: index < strength ? strengthColors[strength - 1] : '#e5e7eb',
              borderRadius: '0.25rem'
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: strength > 0 ? strengthColors[strength - 1] : '#6b7280', marginTop: '0.25rem' }}>
        Força da senha: {strengthLabels[strength - 1] || ''}
      </p>
    </div>
  );
};

export default PasswordStrengthIndicator;
