// src/components/Admin/Contacts/ContactList.tsx - Updated for Backend Integration
import React, { useEffect, useState } from 'react';
import { useContacts } from '../../../hooks/useApiState';
import { apiService } from '../../../services/apiService';
import type { Contact, ContactFilters, ContactListResponse } from '../../../types/api';
import ViewContactModal from './ViewContactModal';
import CreateContactModal from './CreateContactModal';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import './ContactList.css';

interface ContactListProps {
  initialFilters?: ContactFilters;
}

const ContactList: React.FC<ContactListProps> = ({ initialFilters }) => {
  const { contactsData, loading, error, fetchContacts, updateContact, deleteContact, createContact } = useContacts();
  
  // UPDATED: Use 'limit' instead of 'pageSize' to match backend
  const [filters, setFilters] = useState<ContactFilters>({ 
    page: 1, 
    limit: 10, 
    ...(initialFilters ?? {}) 
  });
  const [sort, setSort] = useState<Record<string, any>>({ createdAt: -1 });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [batchLoading, setBatchLoading] = useState(false);
  const [duplicates, setDuplicates] = useState<Array<{
    email: string;
    contacts: Contact[];
    count: number;
  }>>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCreateContact = async (contact: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createContact(contact);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  useEffect(() => {
    // Fetch on filters change
    (async () => {
      await fetchContacts(filters, sort);
    })();
  }, [fetchContacts, filters, sort]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...(prev ?? {}),
      search: query || undefined,
      page: 1
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...(prev ?? {}),
      status: status === 'all' ? undefined : (status as Contact['status']),
      page: 1
    }));
  };

  const handlePriorityFilter = (priority: string) => {
    setFilters(prev => ({
      ...(prev ?? {}),
      priority: priority === 'all' ? undefined : (priority as 'low' | 'medium' | 'high'),
      page: 1
    }));
  };

  const handleStatusUpdate = async (contactId: string, newStatus: Contact['status']) => {
    try {
      if (newStatus) {
        await updateContact(contactId, { status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Tem certeza que deseja excluir este contato?',
      onConfirm: async () => {
        try {
          await deleteContact(contactId);
        } catch (error) {
          console.error('Failed to delete contact:', error);
        }
        setConfirmDialog(null);
      },
    });
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...(prev ?? {}), page }));
  };

  // UPDATED: Better handling of ContactListResponse vs Contact[]
  const isContactListResponse = (data: any): data is ContactListResponse => {
    return data && typeof data === 'object' && 'contacts' in data && Array.isArray(data.contacts);
  };

  const contactsList: Contact[] = isContactListResponse(contactsData)
    ? contactsData.contacts
    : (Array.isArray(contactsData) ? contactsData : []);

  const total = isContactListResponse(contactsData) ? contactsData.total : contactsList.length;
  const pages = isContactListResponse(contactsData) ? contactsData.pages : 1;
  const currentPage = isContactListResponse(contactsData) ? contactsData.page : (filters.page || 1);
  const limit = isContactListResponse(contactsData) ? contactsData.limit : (filters.limit || 10);

  const handleSort = (field: string) => {
    setSort(prev => {
      const newSort: Record<string, any> = {};
      if (prev[field]) {
        newSort[field] = prev[field] === 1 ? -1 : 1;
      } else {
        newSort[field] = 1;
      }
      return newSort;
    });
  };

  const handleSelectContact = (contactId: string | undefined, selected: boolean) => {
    if (!contactId) return;
    setSelectedContacts(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(contactId);
      } else {
        newSet.delete(contactId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedContacts(new Set(contactsList.map(c => c._id || c.id || '').filter(id => id)));
    } else {
      setSelectedContacts(new Set());
    }
  };

  const handleBatchStatusUpdate = async (status: Contact['status']) => {
    if (selectedContacts.size === 0) {
      alert('Selecione pelo menos um contato');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      message: `Tem certeza que deseja marcar ${selectedContacts.size} contato(s) como "${status}"?`,
      onConfirm: async () => {
        setBatchLoading(true);
        try {
          const result = await apiService.contacts.batchUpdate(Array.from(selectedContacts), status as any);
          if (result.success) {
            alert(`${result.data?.modifiedCount} contato(s) atualizado(s) com sucesso`);
            setSelectedContacts(new Set());
            // Refresh the list
            fetchContacts(filters, sort);
          } else {
            alert('Erro ao atualizar contatos: ' + result.message);
          }
        } catch (error) {
          console.error('Batch update error:', error);
          alert('Erro ao atualizar contatos');
        } finally {
          setBatchLoading(false);
        }
        setConfirmDialog(null);
      },
    });
  };

  const handleFindDuplicates = async () => {
    try {
      const result = await apiService.contacts.findDuplicates();
      if (result.success) {
        setDuplicates(result.data || []);
        setShowDuplicates(true);
      } else {
        alert('Erro ao buscar duplicados: ' + result.message);
      }
    } catch (error) {
      console.error('Find duplicates error:', error);
      alert('Erro ao buscar contatos duplicados');
    }
  };

  const handleMergeDuplicates = async (primaryId: string, duplicateIds: string[]) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Tem certeza que deseja mesclar estes contatos? Os duplicados serão marcados como mesclados.',
      onConfirm: async () => {
        try {
          const result = await apiService.contacts.mergeDuplicates(primaryId, duplicateIds);
          if (result.success) {
            alert('Contatos mesclados com sucesso');
            setShowDuplicates(false);
            fetchContacts(filters, sort);
          } else {
            alert('Erro ao mesclar contatos: ' + result.message);
          }
        } catch (error) {
          console.error('Merge duplicates error:', error);
          alert('Erro ao mesclar contatos');
        }
        setConfirmDialog(null);
      },
    });
  };

  return (
    <div className="contact-list">
      {/* Header with filters */}
      <div className="contact-list-header">
        <h2>Gerenciar Contatos</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>Criar Contato</button>
          <button className="btn btn-secondary" onClick={handleFindDuplicates}>Buscar Duplicados</button>
        </div>
        <div className="contact-filters">
          <div className="search-box">
            <input 
              className="search-input"
              type="text"
              placeholder="Buscar por nome, email, clínica..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <div className="status-filters">
            <button 
              className={`filter-button ${(!filters.status || filters.status === 'all') ? 'active' : ''}`}
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
            <button
              className={`filter-button ${filters.status === 'closed' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('closed')}
            >
              Fechados
            </button>
          </div>

          <div className="priority-filters">
            <label>Prioridade:</label>
            <button
              className={`filter-button ${(!filters.priority || filters.priority === 'all') ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('all')}
            >
              Todas
            </button>
            <button
              className={`filter-button ${filters.priority === 'high' ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('high')}
            >
              Alta
            </button>
            <button
              className={`filter-button ${filters.priority === 'medium' ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('medium')}
            >
              Média
            </button>
            <button
              className={`filter-button ${filters.priority === 'low' ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('low')}
            >
              Baixa
            </button>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateContactModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreate={handleCreateContact} 
        />
      )}

      {selectedContact && (
        <ViewContactModal contact={selectedContact} onClose={() => setSelectedContact(null)} />
      )}

      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => fetchContacts(filters)}>Tentar novamente</button>
        </div>
      )}

      {/* Loading state */}
      {loading && !contactsData && (
        <div className="contact-list-loading">
          <div className="loading-spinner">Carregando contatos...</div>
        </div>
      )}

      {/* Batch actions */}
      {selectedContacts.size > 0 && (
        <div className="batch-actions">
          <span>{selectedContacts.size} contato(s) selecionado(s)</span>
          <div className="batch-buttons">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleBatchStatusUpdate('contacted')}
              disabled={batchLoading}
            >
              Marcar como Contatado
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleBatchStatusUpdate('qualified')}
              disabled={batchLoading}
            >
              Marcar como Qualificado
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleBatchStatusUpdate('converted')}
              disabled={batchLoading}
            >
              Marcar como Convertido
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleBatchStatusUpdate('closed')}
              disabled={batchLoading}
            >
              Marcar como Fechado
            </button>
          </div>
        </div>
      )}

      {/* Duplicates section */}
      {showDuplicates && duplicates.length > 0 && (
        <div className="duplicates-section">
          <h3>Contatos Duplicados Encontrados</h3>
          {duplicates.map((duplicate, index) => (
            <div key={index} className="duplicate-group">
              <h4>Email: {duplicate.email} ({duplicate.count} contatos)</h4>
              <div className="duplicate-contacts">
                {duplicate.contacts.map((contact, idx) => (
                  <div key={contact._id || idx} className="duplicate-contact">
                    <span>{contact.name} - {contact.clinic} - {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-BR') : ''}</span>
                    {idx === 0 && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleMergeDuplicates(
                          contact._id || '',
                          duplicate.contacts.slice(1).map(c => c._id || '').filter(id => id)
                        )}
                      >
                        Manter este e mesclar outros
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={() => setShowDuplicates(false)}>Fechar</button>
        </div>
      )}

      {/* Loading overlay for updates */}
      {loading && contactsData && (
        <div className="loading-overlay">
          <div className="loading-spinner">Atualizando...</div>
        </div>
      )}

      {/* Contact table */}
      {!loading || contactsData ? (
        <>
          <div className="contact-table-container">
            {contactsList.length > 0 ? (
              <table className="contact-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedContacts.size === contactsList.length && contactsList.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th onClick={() => handleSort('name')}>
                      Nome {sort.name && (sort.name === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('email')}>
                      Email {sort.email && (sort.email === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('clinic')}>
                      Clínica {sort.clinic && (sort.clinic === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('specialty')}>
                      Especialidade {sort.specialty && (sort.specialty === 1 ? '▲' : '▼')}
                    </th>
                    <th>Telefone</th>
                    <th onClick={() => handleSort('status')}>
                      Status {sort.status && (sort.status === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('createdAt')}>
                      Data {sort.createdAt && (sort.createdAt === 1 ? '▲' : '▼')}
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contactsList.map((contact) => {
                    const contactId = contact._id || contact.id || '';
                    return (
                      <tr key={contactId} className="contact-row">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedContacts.has(contactId)}
                            onChange={(e) => handleSelectContact(contactId, e.target.checked)}
                          />
                        </td>
                        <td>
                          <div className="contact-name">{contact.name}</div>
                        </td>
                        <td>
                          <div className="contact-email">
                            <a href={`mailto:${contact.email}`}>{contact.email}</a>
                          </div>
                        </td>
                        <td>
                          <div className="contact-clinic">{contact.clinic}</div>
                        </td>
                        <td>
                          <div className="contact-specialty">{contact.specialty}</div>
                        </td>
                        <td>
                          <div className="contact-phone">
                            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                          </div>
                        </td>
                        <td className="contact-status">
                          <select 
                            className="status-select"
                            value={contact.status || 'new'} 
                            onChange={(e) => handleStatusUpdate(contactId, e.target.value as Contact['status'])}
                          >
                            <option value="new">Novo</option>
                            <option value="contacted">Contatado</option>
                            <option value="qualified">Qualificado</option>
                            <option value="converted">Convertido</option>
                            <option value="closed">Fechado</option>
                          </select>
                        </td>
                        <td>
                          <div className="contact-date">
                            {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-BR') : '-'}
                          </div>
                        </td>
                        <td>
                          <div className="contact-actions">
                            <button 
                              className="action-button view"
                              title="Visualizar detalhes"
                              onClick={() => handleViewContact(contact)}
                            >
                              👁️
                            </button>
                            <button 
                              className="action-button delete"
                              title="Excluir contato"
                              onClick={() => handleDeleteContact(contactId)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>Nenhum contato encontrado</h3>
                <p>
                  {searchQuery || filters.status 
                    ? 'Não há contatos que correspondam aos filtros aplicados.'
                    : 'Você ainda não tem contatos registrados.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {contactsList.length > 0 && pages > 1 && (
            <div className="pagination">
              <div className="pagination-info">
                Exibindo {Math.min((currentPage - 1) * limit + 1, total)} - {Math.min(currentPage * limit, total)} de {total} contatos
              </div>
              
              <div className="pagination-controls">
                <button 
                  className="pagination-button"
                  disabled={currentPage <= 1} 
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Anterior
                </button>
                
                <span className="pagination-current">
                  Página {currentPage} de {pages}
                </span>
                
                <button 
                  className="pagination-button"
                  disabled={currentPage >= pages} 
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}

      {confirmDialog && (
        <Modal
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          title="Confirmar"
          description={confirmDialog.message}
        >
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => confirmDialog.onConfirm()}>
              Confirmar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactList;