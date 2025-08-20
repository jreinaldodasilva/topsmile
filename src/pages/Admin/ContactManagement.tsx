// src/pages/Admin/ContactManagement.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ContactList from '../../components/Admin/Contacts/ContactList';
import { Contact } from '../../services/apiService';
import './ContactManagement.css';

const ContactManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleLogout = () => {
    logout();
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  return (
    <div className="contact-management">
      <header className="contact-management-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Gerenciar Contatos</h1>
            <p>Bem-vindo, {user?.name} ({user?.role})</p>
          </div>
          <div className="header-actions">
            <button onClick={() => window.location.href = '/admin'} className="back-button">
              ← Dashboard
            </button>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="contact-management-content">
        <ContactList onContactSelect={handleContactSelect} />
      </main>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="contact-modal-overlay" onClick={handleCloseModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalhes do Contato</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="contact-details">
                <div className="detail-section">
                  <h3>Informações Pessoais</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Nome:</label>
                      <span>{selectedContact.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>E-mail:</label>
                      <span>
                        <a href={`mailto:${selectedContact.email}`}>
                          {selectedContact.email}
                        </a>
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Telefone:</label>
                      <span>
                        <a href={`tel:${selectedContact.phone}`}>
                          {selectedContact.phone}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Informações Profissionais</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Clínica:</label>
                      <span>{selectedContact.clinic}</span>
                    </div>
                    <div className="detail-item">
                      <label>Especialidade:</label>
                      <span>{selectedContact.specialty}</span>
                    </div>
                    <div className="detail-item">
                      <label>Origem:</label>
                      <span>{selectedContact.source}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Status e Acompanhamento</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Status atual:</label>
                      <span className={`status-badge status-${selectedContact.status}`}>
                        {getStatusLabel(selectedContact.status)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Data de cadastro:</label>
                      <span>{formatDate(selectedContact.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Última atualização:</label>
                      <span>{formatDate(selectedContact.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedContact.assignedTo && (
                  <div className="detail-section">
                    <h3>Responsável</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Atribuído a:</label>
                        <span>{selectedContact.assignedTo.name}</span>
                      </div>
                      <div className="detail-item">
                        <label>E-mail do responsável:</label>
                        <span>
                          <a href={`mailto:${selectedContact.assignedTo.email}`}>
                            {selectedContact.assignedTo.email}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedContact.notes && (
                  <div className="detail-section">
                    <h3>Observações</h3>
                    <div className="notes-content">
                      {selectedContact.notes}
                    </div>
                  </div>
                )}

                {selectedContact.followUpDate && (
                  <div className="detail-section">
                    <h3>Próximo Follow-up</h3>
                    <div className="followup-date">
                      {formatDate(selectedContact.followUpDate)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button className="action-button secondary" onClick={handleCloseModal}>
                Fechar
              </button>
              <button className="action-button primary">
                Editar Contato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getStatusLabel = (status: Contact['status']): string => {
  const labels: Record<Contact['status'], string> = {
    'new': 'Novo',
    'contacted': 'Contatado',
    'qualified': 'Qualificado',
    'converted': 'Convertido',
    'closed': 'Fechado'
  };
  return labels[status] || status;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default ContactManagement;