// src/pages/Admin/ScheduleAppointmentModal.tsx
import React from 'react';
import type { Patient } from '../../../packages/types/src/index';
import AppointmentForm from '../../components/Admin/Forms/AppointmentForm';
import './ScheduleAppointmentModal.css';
import type { Patient } from '@topsmile/types';


interface ScheduleAppointmentModalProps {
  patient: Patient;
  onClose: () => void;
}

const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({ patient, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agendar Consulta para {patient.fullName}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <AppointmentForm 
            onSave={() => { // TODO: implement save
              onClose();
            }}
            onCancel={onClose} 
            preselectedPatient={patient}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointmentModal;
