import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import PatientNavigation from '../../../components/PatientNavigation';
import './PatientDocuments.css';

const PatientDocuments: React.FC = () => {
    const { patientUser, isAuthenticated } = usePatientAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/patient/login');
        }
    }, [isAuthenticated, navigate]);

    const consentForms = (patientUser?.patient as any)?.consentForms || [];

    return (
        <div className="patient-documents">
            <PatientNavigation activePage="documents" />

            <div className="documents-content">
                <header className="documents-header">
                    <h1>Meus Documentos</h1>
                </header>

                <main className="documents-main">
                    <section className="document-section">
                        <h2>Termos de Consentimento</h2>
                        {consentForms.length > 0 ? (
                            <div className="documents-list">
                                {consentForms.map((form: any, idx: number) => (
                                    <div key={idx} className="document-card">
                                        <div className="document-icon">📄</div>
                                        <div className="document-info">
                                            <h3>{form.formType}</h3>
                                            <p>Assinado em: {new Date(form.signedAt).toLocaleDateString('pt-BR')}</p>
                                            {form.version && <p className="version">Versão: {form.version}</p>}
                                        </div>
                                        {form.documentUrl && (
                                            <a
                                                href={form.documentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="view-btn"
                                            >
                                                Visualizar
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-state">Nenhum documento assinado</p>
                        )}
                    </section>

                    <section className="document-section">
                        <h2>Documentos Pendentes</h2>
                        <p className="empty-state">Nenhum documento pendente</p>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default PatientDocuments;
