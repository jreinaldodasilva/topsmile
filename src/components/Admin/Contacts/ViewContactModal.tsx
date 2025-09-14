// src/components/Admin/Contacts/ViewContactModal.tsx
import React from 'react';
import type { Contact } from '../../../types/api';
import './ViewContactModal.css';

interface ViewContactModalProps {
  contact: Contact;
  onClose: () => void;
}

const ViewContactModal: React.FC<ViewContactModalProps> = ({ contact, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalhes do Contato</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="contact-details">
            <p><strong>Nome:</strong> {contact.name}</p>
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Telefone:</strong> {contact.phone}</p>
            <p><strong>Clínica:</strong> {contact.clinic}</p>
            <p><strong>Especialidade:</strong> {contact.specialty}</p>
            <p><strong>Status:</strong> {contact.status}</p>
            <p><strong>Data de Criação:</strong> {new Date(contact.createdAt || '').toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ViewContactModal;
