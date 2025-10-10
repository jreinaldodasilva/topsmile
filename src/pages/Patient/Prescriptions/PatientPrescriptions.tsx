import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import { apiService } from '../../../services/apiService';
import PatientNavigation from '../../../components/PatientNavigation';
import './PatientPrescriptions.css';

const PatientPrescriptions: React.FC = () => {
    const { patientUser, isAuthenticated } = usePatientAuth();
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/patient/login');
            return;
        }

        const fetchPrescriptions = async () => {
            try {
                const response = await apiService.prescriptions.getAll(patientUser!.patient._id);
                if (response.success && response.data) {
                    setPrescriptions(response.data);
                }
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (patientUser) {
            fetchPrescriptions();
        }
    }, [isAuthenticated, navigate, patientUser]);

    if (loading) {
        return (
            <div className="patient-prescriptions">
                <PatientNavigation activePage="prescriptions" />
                <div className="loading-state">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="patient-prescriptions">
            <PatientNavigation activePage="prescriptions" />

            <div className="prescriptions-content">
                <header className="prescriptions-header">
                    <h1>Minhas Receitas</h1>
                </header>

                <main className="prescriptions-main">
                    {prescriptions.length === 0 ? (
                        <div className="empty-state">
                            <p>Você não possui receitas registradas</p>
                        </div>
                    ) : (
                        <div className="prescriptions-list">
                            {prescriptions.map(prescription => (
                                <div key={prescription._id} className="prescription-card">
                                    <div className="prescription-header">
                                        <h3>
                                            Receita -{' '}
                                            {new Date(prescription.prescribedDate).toLocaleDateString('pt-BR')}
                                        </h3>
                                        <span className={`status ${prescription.status}`}>{prescription.status}</span>
                                    </div>
                                    <div className="prescription-body">
                                        {prescription.medications.map((med: any, idx: number) => (
                                            <div key={idx} className="medication">
                                                <strong>{med.name}</strong>
                                                <p>Dosagem: {med.dosage}</p>
                                                <p>Frequência: {med.frequency}</p>
                                                <p>Duração: {med.duration}</p>
                                                {med.instructions && <p className="instructions">{med.instructions}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PatientPrescriptions;
