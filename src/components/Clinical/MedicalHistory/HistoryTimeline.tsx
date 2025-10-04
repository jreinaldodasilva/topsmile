// src/components/Clinical/MedicalHistory/HistoryTimeline.tsx
import React from 'react';
import './HistoryTimeline.css';

interface HistoryRecord {
  id: string;
  recordDate: string;
  chiefComplaint?: string;
  chronicConditions?: string[];
  allergies?: any[];
  medications?: any[];
  recordedBy: { name: string };
}

interface HistoryTimelineProps {
  records: HistoryRecord[];
  onViewRecord: (recordId: string) => void;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ records, onViewRecord }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="history-timeline">
      {records.length === 0 ? (
        <div className="no-records">
          <p>Nenhum histórico médico registrado</p>
        </div>
      ) : (
        <div className="timeline-list">
          {records.map((record) => (
            <div key={record.id} className="timeline-record">
              <div className="record-date">{formatDate(record.recordDate)}</div>
              <div className="record-content">
                {record.chiefComplaint && (
                  <div className="record-complaint">
                    <strong>Queixa:</strong> {record.chiefComplaint}
                  </div>
                )}
                <div className="record-summary">
                  {record.chronicConditions && record.chronicConditions.length > 0 && (
                    <span className="summary-badge">
                      {record.chronicConditions.length} condição(ões)
                    </span>
                  )}
                  {record.allergies && record.allergies.length > 0 && (
                    <span className="summary-badge alert">
                      {record.allergies.length} alergia(s)
                    </span>
                  )}
                  {record.medications && record.medications.length > 0 && (
                    <span className="summary-badge">
                      {record.medications.length} medicamento(s)
                    </span>
                  )}
                </div>
                <div className="record-footer">
                  <span>Registrado por: {record.recordedBy.name}</span>
                  <button onClick={() => onViewRecord(record.id)} className="view-record-btn">
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
