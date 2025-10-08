import React, { useState } from 'react';
import { Input, SimpleSelect } from '../../UI';

interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number;
  endDate?: Date;
  occurrences?: number;
}

interface RecurringAppointmentFormProps {
  pattern?: RecurringPattern;
  onChange: (pattern: RecurringPattern) => void;
}

export const RecurringAppointmentForm: React.FC<RecurringAppointmentFormProps> = ({
  pattern,
  onChange
}) => {
  const [endType, setEndType] = useState<'date' | 'occurrences'>('occurrences');

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...pattern!, frequency: e.target.value as any });
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...pattern!, interval: parseInt(e.target.value) || 1 });
  };

  const handleOccurrencesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...pattern!, occurrences: parseInt(e.target.value) || 1, endDate: undefined });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...pattern!, endDate: new Date(e.target.value), occurrences: undefined });
  };

  return (
    <div style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', marginTop: '10px', backgroundColor: '#f9f9f9' }}>
      <h4 style={{ marginTop: 0 }}>Configuração de Recorrência</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
        <SimpleSelect
          label="Frequência"
          value={pattern?.frequency || 'weekly'}
          onChange={handleFrequencyChange}
        >
          <option value="daily">Diariamente</option>
          <option value="weekly">Semanalmente</option>
          <option value="biweekly">Quinzenalmente</option>
          <option value="monthly">Mensalmente</option>
        </SimpleSelect>

        <Input
          label="Intervalo"
          type="number"
          min="1"
          value={pattern?.interval || 1}
          onChange={handleIntervalChange}
          helperText="A cada quantas semanas/meses"
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Término da Recorrência
        </label>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={endType === 'occurrences'}
              onChange={() => setEndType('occurrences')}
              style={{ marginRight: '5px' }}
            />
            Número de ocorrências
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={endType === 'date'}
              onChange={() => setEndType('date')}
              style={{ marginRight: '5px' }}
            />
            Data final
          </label>
        </div>

        {endType === 'occurrences' ? (
          <Input
            type="number"
            min="1"
            max="52"
            value={pattern?.occurrences || 10}
            onChange={handleOccurrencesChange}
            placeholder="Número de consultas"
          />
        ) : (
          <Input
            type="date"
            value={pattern?.endDate ? new Date(pattern.endDate).toISOString().split('T')[0] : ''}
            onChange={handleEndDateChange}
            min={new Date().toISOString().split('T')[0]}
          />
        )}
      </div>
    </div>
  );
};
