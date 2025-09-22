// src/components/Admin/Contacts/CreateContactModal.tsx
import React, { useState } from 'react';
import type { Contact } from '../../../../packages/types/src/index';
import './CreateContactModal.css';
import type { Contact } from '@topsmile/types';


interface CreateContactModalProps {
  onClose: () => void;
  onCreate: (contact: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState<Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    phone: '',
    clinic: '',
    specialty: '',
    status: 'new',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Criar Novo Contato</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-field">
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-field">
              <label htmlFor="phone">Telefone</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="form-field">
              <label htmlFor="clinic">Clínica</label>
              <input type="text" id="clinic" name="clinic" value={formData.clinic} onChange={handleInputChange} />
            </div>
            <div className="form-field">
              <label htmlFor="specialty">Especialidade</label>
              <input type="text" id="specialty" name="specialty" value={formData.specialty} onChange={handleInputChange} />
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="new">Novo</option>
                <option value="contacted">Contatado</option>
                <option value="qualified">Qualificado</option>
                <option value="converted">Convertido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContactModal;
