import React, { memo } from 'react';
import type { Patient } from '../../../packages/types/src/index';
import { formatDate, calculateAge, getGenderLabel } from '../../utils/patientFormatters';

interface PatientRowProps {
    patient: Patient;
    onView: (patient: Patient) => void;
    onEdit: (patient: Patient) => void;
    onSchedule: (patient: Patient) => void;
    onDelete: (patientId: string) => void;
}

const PatientRow: React.FC<PatientRowProps> = ({ patient, onView, onEdit, onSchedule, onDelete }) => (
    <tr className="patient-row">
        <td>
            <div className="patient-info">
                <div className="patient-name">{patient.fullName}</div>
                <div className="patient-email">{patient.email}</div>
            </div>
        </td>
        <td>
            <div className="contact-info">
                <div>{patient.phone}</div>
            </div>
        </td>
        <td>{calculateAge(patient.dateOfBirth)}</td>
        <td>{getGenderLabel(patient.gender)}</td>
        <td>{patient.cpf || '-'}</td>
        <td>{formatDate(patient.updatedAt)}</td>
        <td>
            <span className={`status-badge ${patient.isActive ? 'active' : 'inactive'}`}>
                {patient.isActive ? 'Ativo' : 'Inativo'}
            </span>
        </td>
        <td>
            <div className="action-buttons">
                <button className="btn btn-sm btn-outline" onClick={() => onView(patient)} title="Ver detalhes">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                </button>
                <button className="btn btn-sm btn-outline" onClick={() => onEdit(patient)} title="Editar">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </button>
                <button className="btn btn-sm btn-outline" onClick={() => onSchedule(patient)} title="Agendar consulta">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </button>
                <button
                    className="btn btn-sm btn-outline btn-danger"
                    onClick={() => patient._id && onDelete(patient._id)}
                    title="Excluir"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </td>
    </tr>
);

export default memo(PatientRow);
