// src/components/Admin/Contacts/ContactList.tsx
import React, { useState, useEffect } from 'react';
import { useContacts } from '../../../hooks/useApiState';
import { Contact, ContactFilters } from '../../../services/apiService';
import './ContactList.css';

interface ContactListProps {
  onContactSelect?: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ onContactSelect }) => {
  const { contactsData, loading, error, fetchContacts, updateContact, deleteContact } = useContacts();
  
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContacts(filters);
  }, [fetchContacts, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      search: query || undefined,
      page: 1
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1
    }));
  };

  const handleStatusUpdate = async (contactId: string, newStatus: Contact['status']) => {
    try {
      await updateContact(contactId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o contato "${contactName}"?`)) {
      try {
        await deleteContact(contactId);
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getStatusColor = (status: Contact['status']): string => {
    const colors: Record<Contact['status'], string> = {
      'new': '#3b82f6',
      'contacted': '#f59e0b',
      'qualified': '#8b5cf6',
      'converted': '#10b981',
      'closed': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

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

  if (loading && !contactsData) {
    return (
      <div className="contact-list-loading">
        <div className="loading-spinner">Carregando contatos...</div>
      </div>
    );
  }

  if (error && !contactsData) {
    return (
      <div className="contact-list-error">
        <h3>Erro ao carregar contatos</h3>
        <p>{error}</p>
        <button onClick={() => fetchContacts(filters)}>Tentar novamente</button>
      </div>
    );
  }

  const contacts = contactsData?.contacts || [];
  const total = contactsData?.total || 0;
  const pages = contactsData?.pages || 1;

  return (
    <div className="contact-list">
      <div className="contact-list-header">
        <h2>Gerenciar Contatos ({total})</h2>
        
        <div className="contact-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nome, email, clínica..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="status-filters">
            <button
              className={`filter-button ${!filters.status ? 'active' : ''}`}
              onClick={() => handleStatusFilter('all')}
            >
              Todos
            </button>
            <button
              className={`filter-button ${filters.status === 'new' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('new')}
            >
              Novos
            </button>
            <button
              className={`filter-button ${filters.status === 'contacted' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('contacted')}
            >
              Contatados
            </button>
            <button
              className={`filter-button ${filters.status === 'qualified' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('qualified')}
            >
              Qualificados
            </button>
            <button
              className={`filter-button ${filters.status === 'converted' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('converted')}
            >
              Convertidos
            </button>
          </div>
        </div>
      </div>

      {error && contactsData && (
        <div className="error-banner">
          <span>⚠️ Erro ao atualizar: {error}</span>
          <button onClick={() => fetchContacts(filters)}>Tentar novamente</button>
        </div>
      )}

      <div className="contact-table-container">
        {contacts.length > 0 ? (
          <table className="contact-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Clínica</th>
                <th>Especialidade</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact: Contact) => (
                <tr 
                  key={contact.id} 
                  className="contact-row"
                  onClick={() => onContactSelect?.(contact)}
                >
                  <td className="contact-name">{contact.name}</td>
                  <td className="contact-clinic">{contact.clinic}</td>
                  <td className="contact-specialty">{contact.specialty}</td>
                  <td className="contact-email">
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </td>
                  <td className="contact-phone">
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </td>
                  <td className="contact-status">
                    <select
                      value={contact.status}
                      onChange={(e) => handleStatusUpdate(contact.id, e.target.value as Contact['status'])}
                      className="status-select"
                      style={{ color: getStatusColor(contact.status) }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="new">Novo</option>
                      <option value="contacted">Contatado</option>
                      <option value="qualified">Qualificado</option>
                      <option value="converted">Convertido</option>
                      <option value="closed">Fechado</option>
                    </select>
                  </td>
                  <td className="contact-date">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="contact-actions">
                    <button
                      className="action-button view"
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactSelect?.(contact);
                      }}
                      title="Ver detalhes"
                    >
                      👁️
                    </button>
                    <button
                      className="action-button delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContact(contact.id, contact.name);
                      }}
                      title="Excluir contato"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📇</div>
            <h3>Nenhum contato encontrado</h3>
            <p>
              {searchQuery || filters.status 
                ? 'Tente ajustar os filtros para encontrar contatos.'
                : 'Quando você receber contatos, eles aparecerão aqui.'
              }
            </p>
          </div>
        )}
      </div>

      {contacts.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Mostrando {((filters.page || 1) - 1) * (filters.limit || 10) + 1} até {Math.min((filters.page || 1) * (filters.limit || 10), total)} de {total} contatos
          </div>
          
          <div className="pagination-controls">
            <button
              className="pagination-button"
              onClick={() => handlePageChange((filters.page || 1) - 1)}
              disabled={!filters.page || filters.page <= 1}
            >
              ← Anterior
            </button>
            
            <span className="pagination-current">
              Página {filters.page || 1} de {pages}
            </span>
            
            <button
              className="pagination-button"
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={!filters.page || filters.page >= pages}
            >
              Próxima →
            </button>
          </div>
        </div>
      )}

      {loading && contactsData && (
        <div className="loading-overlay">
          <div className="loading-spinner">Atualizando...</div>
        </div>
      )}
    </div>
  );
};

export default ContactList;