import React from 'react';
import { Button } from '../../UI';

interface PrescriptionListProps {
  prescriptions: any[];
  onView: (id: string) => void;
  onEdit: (prescription: any) => void;
  onDelete: (id: string) => void;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  onView,
  onEdit,
  onDelete
}) => {
  if (prescriptions.length === 0) {
    return <p style={{ color: '#666' }}>Nenhuma receita encontrada.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {prescriptions.map((rx) => (
        <div key={rx._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
            <div>
              <h3 style={{ margin: 0 }}>{rx.diagnosis || 'Sem diagnóstico'}</h3>
              <p style={{ color: '#666', margin: '5px 0' }}>
                {new Date(rx.prescribedDate).toLocaleDateString('pt-BR')} - Dr. {rx.provider?.name || 'N/A'}
              </p>
              <span style={{ 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '12px',
                background: rx.status === 'active' ? '#d1fae5' : '#e5e7eb',
                color: rx.status === 'active' ? '#065f46' : '#374151'
              }}>
                {rx.status === 'active' ? 'Ativa' : rx.status === 'completed' ? 'Concluída' : 'Cancelada'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" size="sm" onClick={() => onView(rx._id)}>Ver</Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(rx)}>Editar</Button>
              <button onClick={() => onDelete(rx._id)} style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
          <div>
            <strong>Medicamentos:</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              {rx.medications?.map((med: any, i: number) => (
                <li key={i}>
                  <strong>{med.name}</strong> - {med.dosage}, {med.frequency}, {med.duration} ({med.quantity} unidades)
                </li>
              ))}
            </ul>
          </div>
          {rx.notes && (
            <p style={{ marginTop: '10px', color: '#666' }}><strong>Obs:</strong> {rx.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
};
