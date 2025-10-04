// src/components/Calendar/Enhanced/RecurringAppointmentDialog.tsx
import React, { useState } from 'react';
import './RecurringAppointmentDialog.css';

interface RecurringAppointmentDialogProps {
  onSave: (pattern: RecurringPattern) => void;
  onCancel: () => void;
}

interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  endDate?: Date;
  occurrences?: number;
}

export const RecurringAppointmentDialog: React.FC<RecurringAppointmentDialogProps> = ({
  onSave,
  onCancel
}) => {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [interval, setInterval] = useState(1);
  const [endType, setEndType] = useState<'date' | 'occurrences'>('occurrences');
  const [endDate, setEndDate] = useState('');
  const [occurrences, setOccurrences] = useState(10);

  const handleSave = () => {
    const pattern: RecurringPattern = {
      frequency,
      interval,
      ...(endType === 'date' ? { endDate: new Date(endDate) } : { occurrences })
    };
    onSave(pattern);
  };

  return (
    <div className="recurring-dialog-overlay">
      <div className="recurring-dialog">
        <h3>Agendamento Recorrente</h3>

        <div className="form-group">
          <label>Frequência</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)}>
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quinzenal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>

        <div className="form-group">
          <label>Repetir a cada</label>
          <input
            type="number"
            min="1"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value))}
          />
          <span>
            {frequency === 'daily' && 'dia(s)'}
            {frequency === 'weekly' && 'semana(s)'}
            {frequency === 'biweekly' && 'quinzena(s)'}
            {frequency === 'monthly' && 'mês(es)'}
          </span>
        </div>

        <div className="form-group">
          <label>Terminar</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={endType === 'occurrences'}
                onChange={() => setEndType('occurrences')}
              />
              Após
              <input
                type="number"
                min="1"
                value={occurrences}
                onChange={(e) => setOccurrences(parseInt(e.target.value))}
                disabled={endType !== 'occurrences'}
                className="inline-input"
              />
              ocorrências
            </label>
          </div>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={endType === 'date'}
                onChange={() => setEndType('date')}
              />
              Em
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={endType !== 'date'}
                className="inline-input"
              />
            </label>
          </div>
        </div>

        <div className="dialog-actions">
          <button onClick={onCancel} className="cancel-btn">Cancelar</button>
          <button onClick={handleSave} className="save-btn">Criar Série</button>
        </div>
      </div>
    </div>
  );
};
