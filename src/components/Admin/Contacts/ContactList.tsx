// src/components/Admin/Contacts/ContactList.tsx - Updated for React Query
import React, { useState, useCallback } from 'react';
import { useContacts, useMutateContact, useDeleteContact } from '../../../hooks/useContacts';
import { apiService } from '../../../services/apiService';
import type { Contact, ContactFilters, ContactListResponse } from '../../../../packages/types/src/index';
import ViewContactModal from './ViewContactModal';
import CreateContactModal from './CreateContactModal';
import ContactListSkeleton from './ContactListSkeleton';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import './ContactList.css';

interface ContactListProps {
  initialFilters?: ContactFilters;
}

const ContactList: React.FC<ContactListProps> = React.memo(({ initialFilters }) => {
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

  const { data: contactsData, isLoading, error, refetch } = useContacts({ ...filters, ...sort });
  const contactMutation = useMutateContact();
  const deleteContactMutation = useDeleteContact();

  const handleViewContact = useCallback((contact: Contact) => {
    setSelectedContact(contact);
  }, []);

  const handleCreateContact = useCallback(async (contact: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await contactMutation.mutateAsync(contact);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  }, [contactMutation, setIsCreateModalOpen]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      search: query || undefined,
      page: 1
    }));
  }, [setSearchQuery, setFilters]);

  const handleStatusFilter = useCallback((status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : (status as Contact['status']),
      page: 1
    }));
  }, [setFilters]);

  const handlePriorityFilter = useCallback((priority: string) => {
    setFilters(prev => ({
      ...prev,
      priority: priority === 'all' ? undefined : (priority as 'low' | 'medium' | 'high'),
      page: 1
    }));
  }, [setFilters]);

  const handleStatusUpdate = useCallback(async (contactId: string, newStatus: Contact['status']) => {
    try {
      if (newStatus) {
        await contactMutation.mutateAsync({ id: contactId, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  }, [contactMutation]);

  const handleDeleteContact = useCallback(async (contactId: string) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Tem certeza que deseja excluir este contato?',
      onConfirm: async () => {
        try {
          await deleteContactMutation.mutateAsync(contactId);
        } catch (error) {
          console.error('Failed to delete contact:', error);
        }
        setConfirmDialog(null);
      },
    });
  }, [deleteContactMutation, setConfirmDialog]);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, [setFilters]);

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

  const handleSort = useCallback((field: string) => {
    setSort(prev => {
      const newSort: Record<string, any> = {};
      if (prev[field]) {
        newSort[field] = prev[field] === 1 ? -1 : 1;
      } else {
        newSort[field] = 1;
      }
      return newSort;
    });
  }, [setSort]);

  const handleSelectContact = useCallback((contactId: string | undefined, selected: boolean) => {
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
  }, [setSelectedContacts]);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedContacts(new Set(contactsList.map(c => c._id || c.id || '').filter(id => id)));
    } else {
      setSelectedContacts(new Set());
    }
  }, [setSelectedContacts, contactsList]);

  const handleBatchStatusUpdate = useCallback(async (status: Contact['status']) => {
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
            refetch();
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
  }, [selectedContacts, setConfirmDialog, setBatchLoading, refetch, setSelectedContacts]);

  const handleFindDuplicates = useCallback(async () => {
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
  }, [setDuplicates, setShowDuplicates]);

  const handleMergeDuplicates = useCallback(async (primaryId: string, duplicateIds: string[]) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Tem certeza que deseja mesclar estes contatos? Os duplicados serão marcados como mesclados.',
      onConfirm: async () => {
        try {
          const result = await apiService.contacts.mergeDuplicates(primaryId, duplicateIds);
          if (result.success) {
            alert('Contatos mesclados com sucesso');
            setShowDuplicates(false);
            refetch();
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
  }, [setConfirmDialog, setShowDuplicates, refetch]);

  return (
    <div className="contact-list">
      {/* Header with filters */}
      <div className="contact-list-header">
        <h2>Gerenciar Contatos</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)} aria-label="Criar novo contato">Criar Contato</button>
          <button className="btn btn-secondary" onClick={handleFindDuplicates} aria-label="Encontrar contatos duplicados">Buscar Duplicados</button>
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
              aria-label="Filtrar por todos os status"
            >
              Todos
            </button>
            <button 
              className={`filter-button ${filters.status === 'new' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('new')}
              aria-label="Filtrar por status: Novo"
            >
              Novos
            </button>
            <button 
              className={`filter-button ${filters.status === 'contacted' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('contacted')}
              aria-label="Filtrar por status: Contatado"
            >
              Contatados
            </button>
            <button 
              className={`filter-button ${filters.status === 'qualified' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('qualified')}
              aria-label="Filtrar por status: Qualificado"
            >
              Qualificados
            </button>
            <button 
              className={`filter-button ${filters.status === 'converted' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('converted')}
              aria-label="Filtrar por status: Convertido"
            >
              Convertidos
            </button>
            <button
              className={`filter-button ${filters.status === 'closed' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('closed')}
              aria-label="Filtrar por status: Fechado"
            >
              Fechados
            </button>
          </div>

          <div className="priority-filters">
            <label>Prioridade:</label>
            <button
              className={`filter-button ${(!filters.priority || filters.priority === 'all') ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('all')}
              aria-label="Filtrar por todas as prioridades"
            >
              Todas
            </button>
            <button
              className={`filter-button ${filters.priority === 'high' ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('high')}
              aria-label="Filtrar por prioridade: Alta"
            >
              Alta
            </button>
            <button
              className={`filter-button ${filters.priority === 'medium' ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('medium')}
              aria-label="Filtrar por prioridade: Média"
            >
              Média
            </button>
            <button
              className={`filter-button ${filters.priority === 'low' ? 'active' : ''}`}
              onClick={() => handlePriorityFilter('low')}
              aria-label="Filtrar por prioridade: Baixa"
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

{error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          <span>⚠️ {error.message}</span>
          <button onClick={() => refetch()}>Tentar novamente</button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !contactsData && (
        <div role="status" aria-live="polite">
          <ContactListSkeleton />
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
      {(isLoading || contactMutation.isPending || deleteContactMutation.isPending) && (
        <div className="loading-overlay">
          <div className="loading-spinner">Atualizando...</div>
        </div>
      )}

      {/* Contact table */}
      {!isLoading || contactsData ? (
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
                    <th onClick={() => handleSort('name')} aria-sort={sort.name ? (sort.name === 1 ? 'ascending' : 'descending') : 'none'}>
                      Nome {sort.name && (sort.name === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('email')} aria-sort={sort.email ? (sort.email === 1 ? 'ascending' : 'descending') : 'none'}>
                      Email {sort.email && (sort.email === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('clinic')} aria-sort={sort.clinic ? (sort.clinic === 1 ? 'ascending' : 'descending') : 'none'}>
                      Clínica {sort.clinic && (sort.clinic === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('specialty')} aria-sort={sort.specialty ? (sort.specialty === 1 ? 'ascending' : 'descending') : 'none'}>
                      Especialidade {sort.specialty && (sort.specialty === 1 ? '▲' : '▼')}
                    </th>
                    <th>Telefone</th>
                    <th onClick={() => handleSort('status')} aria-sort={sort.status ? (sort.status === 1 ? 'ascending' : 'descending') : 'none'}>
                      Status {sort.status && (sort.status === 1 ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('createdAt')} aria-sort={sort.createdAt ? (sort.createdAt === 1 ? 'ascending' : 'descending') : 'none'}>
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
});

export default ContactList;
