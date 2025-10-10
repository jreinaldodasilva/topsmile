import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import PatientNavigation from '../../../components/PatientNavigation';
import './PatientMedicalRecords.css';

const PatientMedicalRecords: React.FC = () => {
    const { patientUser, isAuthenticated } = usePatientAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/patient/login');
        }
    }, [isAuthenticated, navigate]);

    const medicalHistory = patientUser?.patient?.medicalHistory;

    return (
        <div className="patient-medical-records">
            <PatientNavigation activePage="medical-records" />

            <div className="records-content">
                <header className="records-header">
                    <h1>Histórico Médico</h1>
                    <button onClick={() => navigate('/patient/profile')} className="edit-btn">
                        Editar Informações
                    </button>
                </header>

                <main className="records-main">
                    <section className="record-section">
                        <h2>Alergias</h2>
                        {medicalHistory?.allergies && medicalHistory.allergies.length > 0 ? (
                            <ul>
                                {medicalHistory.allergies.map((allergy, idx) => (
                                    <li key={idx}>{allergy}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-state">Nenhuma alergia registrada</p>
                        )}
                    </section>

                    <section className="record-section">
                        <h2>Medicações</h2>
                        {medicalHistory?.medications && medicalHistory.medications.length > 0 ? (
                            <ul>
                                {medicalHistory.medications.map((med, idx) => (
                                    <li key={idx}>{med}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-state">Nenhuma medicação registrada</p>
                        )}
                    </section>

                    <section className="record-section">
                        <h2>Condições Médicas</h2>
                        {medicalHistory?.conditions && medicalHistory.conditions.length > 0 ? (
                            <ul>
                                {medicalHistory.conditions.map((condition, idx) => (
                                    <li key={idx}>{condition}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="empty-state">Nenhuma condição registrada</p>
                        )}
                    </section>

                    {medicalHistory?.notes && (
                        <section className="record-section">
                            <h2>Observações</h2>
                            <p>{medicalHistory.notes}</p>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PatientMedicalRecords;
