import React, { useState, useEffect } from 'react';
import { useContacts } from '../../../hooks/useApiState';
import { apiService } from '../../../services/apiService';
import Modal from '../../UI/Modal/Modal';
import Button from '../../UI/Button/Button';
import './ContactList.css';

// Enhanced ContactList component with new backend features
const EnhancedContactList: React.FC = () => {
  const { contactsData, loading, error, fetchContacts, updateContact } = useContacts();
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [showDuplicateManager, setShowDuplicateManager] = useState(false);
  const [duplicates, setDuplicates] = useState<any[]>([]);

  // Load contacts on component mount and filter changes
  useEffect(() => {
    fetchContacts(filters);
  }, [fetchContacts, filters]);

  // Enhanced filter handling with new backend fields
  const handleAdvancedFilter = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Batch status update using new backend endpoint
  const handleBatchStatusUpdate = async (status: string) => {
    if (selectedContacts.length === 0) return;

    try {
      const response = await apiService.contacts.batchUpdate(selectedContacts, { status });
      if (response.success) {
        // Refresh the contacts list
        await fetchContacts(filters);
        setSelectedContacts([]);
        setShowBatchActions(false);
        alert(`${response.data?.modifiedCount || 0} contatos atualizados com sucesso!`);
      }
    } catch (error) {
      console.error('Batch update failed:', error);
      alert('Erro ao atualizar contatos em lote');
    }
  };

  // Load duplicate contacts using new backend endpoint
  const loadDuplicates = async () => {
    try {
      const response = await apiService.contacts.findDuplicates();
      if (response.success) {
        setDuplicates(response.data || []);
        setShowDuplicateManager(true);
      }
    } catch (error) {
      console.error('Error loading duplicates:', error);
    }
  };

  // Merge duplicate contacts using new backend endpoint
  const mergeDuplicates = async (primaryId: string, duplicateIds: string[]) => {
    try {
      const response = await apiService.contacts.mergeDuplicates(primaryId, duplicateIds);
      if (response.success) {
        alert('Contatos mesclados com sucesso!');
        loadDuplicates(); // Refresh duplicate list
        fetchContacts(filters); // Refresh main list
      }
    } catch (error) {
      console.error('Error merging duplicates:', error);
      alert('Erro ao mesclar contatos');
    }
  };

  // Toggle contact selection for batch operations
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  // Contact list rendering with enhanced fields
  const renderContactRow = (contact: any) => {
    const isSelected = selectedContacts.includes(contact._id || contact.id);
    const contactId = contact._id || contact.id;

    return (
      <tr key={contactId} className={`contact-row ${isSelected ? 'selected' : ''}`}>
        <td>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleContactSelection(contactId)}
          />
        </td>
        <td>
          <div className="contact-name">
            {contact.name}
            {/* NEW: Priority indicator */}
            {contact.priority && contact.priority !== 'medium' && (
              <span className={`priority-badge priority-${contact.priority}`}>
                {contact.priority === 'high' ? '🔥' : '🔽'}
              </span>
            )}
          </div>
        </td>
        <td>
          <div className="contact-email">
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            {/* NEW: Lead score display */}
            {contact.leadScore && (
              <div className="lead-score">
                Score: {contact.leadScore}/100
              </div>
            )}
          </div>
        </td>
        <td>{contact.clinic}</td>
        <td>{contact.specialty}</td>
        <td>
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        </td>
        <td>
          <select
            className={`status-select status-${contact.status}`}
            value={contact.status || 'new'}
            onChange={(e) => updateContact(contactId, { status: e.target.value })}
          >
            <option value="new">Novo</option>
            <option value="contacted">Contatado</option>
            <option value="qualified">Qualificado</option>
            <option value="converted">Convertido</option>
            <option value="closed">Fechado</option>
          </select>
        </td>
        <td>
          {/* NEW: Enhanced priority selector */}
          <select
            className={`priority-select priority-${contact.priority || 'medium'}`}
            value={contact.priority || 'medium'}
            onChange={(e) => updateContact(contactId, { priority: e.target.value })}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </td>
        <td>
          {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-BR') : '-'}
          {/* NEW: Last contacted indicator */}
          {contact.lastContactedAt && (
            <div className="last-contacted">
              Último contato: {new Date(contact.lastContactedAt).toLocaleDateString('pt-BR')}
            </div>
          )}
        </td>
        <td>
          <div className="contact-actions">
            <button title="Visualizar" onClick={() => console.log('View', contactId)}>
              👁️
            </button>
            <button title="Agendar follow-up" onClick={() => console.log('Schedule', contactId)}>
              📅
            </button>
            <button title="Excluir" onClick={() => console.log('Delete', contactId)}>
              🗑️
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const contactsList = Array.isArray(contactsData?.contacts) ? contactsData.contacts :
                      Array.isArray(contactsData) ? contactsData : [];

  return (
    <div className="enhanced-contact-list">
      {/* Enhanced Header with Advanced Actions */}
      <div className="contact-list-header">
        <h2>Gerenciar Contatos</h2>
        
        <div className="advanced-actions">
          <Button 
            variant="outline" 
            onClick={loadDuplicates}
            disabled={loading}
          >
            🔍 Encontrar Duplicatas
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowBatchActions(!showBatchActions)}
            disabled={selectedContacts.length === 0}
          >
            ⚡ Ações em Lote ({selectedContacts.length})
          </Button>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="contact-filters">
        <div className="filter-row">
          <input 
            type="text"
            placeholder="Buscar por nome, email, clínica..."
            onChange={(e) => handleAdvancedFilter({ search: e.target.value })}
            className="search-input"
          />
          
          <select onChange={(e) => handleAdvancedFilter({ status: e.target.value })}>
            <option value="">Todos os Status</option>
            <option value="new">Novos</option>
            <option value="contacted">Contatados</option>
            <option value="qualified">Qualificados</option>
            <option value="converted">Convertidos</option>
            <option value="closed">Fechados</option>
          </select>

          <select onChange={(e) => handleAdvancedFilter({ priority: e.target.value })}>
            <option value="">Todas as Prioridades</option>
            <option value="high">Alta Prioridade</option>
            <option value="medium">Média Prioridade</option>
            <option value="low">Baixa Prioridade</option>
          </select>

          <select onChange={(e) => handleAdvancedFilter({ source: e.target.value })}>
            <option value="">Todas as Fontes</option>
            <option value="website_contact_form">Site</option>
            <option value="phone">Telefone</option>
            <option value="email">Email</option>
            <option value="referral">Indicação</option>
          </select>
        </div>
      </div>

      {/* Batch Actions Panel */}
      {showBatchActions && selectedContacts.length > 0 && (
        <div className="batch-actions-panel">
          <h3>Ações em Lote - {selectedContacts.length} selecionados</h3>
          <div className="batch-buttons">
            <Button onClick={() => handleBatchStatusUpdate('contacted')}>
              Marcar como Contatado
            </Button>
            <Button onClick={() => handleBatchStatusUpdate('qualified')}>
              Marcar como Qualificado
            </Button>
            <Button onClick={() => handleBatchStatusUpdate('closed')}>
              Fechar Leads
            </Button>
            <Button variant="outline" onClick={() => setSelectedContacts([])}>
              Limpar Seleção
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Contact Table */}
      <div className="contact-table-container">
        {contactsList.length > 0 ? (
          <table className="enhanced-contact-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts(contactsList.map(c => c._id || c.id));
                      } else {
                        setSelectedContacts([]);
                      }
                    }}
                    checked={selectedContacts.length === contactsList.length && contactsList.length > 0}
                  />
                </th>
                <th>Nome</th>
                <th>Email</th>
                <th>Clínica</th>
                <th>Especialidade</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Data/Último Contato</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contactsList.map(renderContactRow)}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Nenhum contato encontrado</h3>
            <p>Ajuste os filtros ou aguarde novos contatos chegarem.</p>
          </div>
        )}
      </div>

      {/* Duplicate Management Modal */}
      <Modal
        isOpen={showDuplicateManager}
        onClose={() => setShowDuplicateManager(false)}
        title="Gerenciar Contatos Duplicados"
        size="lg"
      >
        <div className="duplicate-manager">
          {duplicates.length > 0 ? (
            <div className="duplicates-list">
              {duplicates.map((group, index) => (
                <div key={index} className="duplicate-group">
                  <h4>📧 {group.email} ({group.count} contatos)</h4>
                  <div className="duplicate-contacts">
                    {group.contacts.map((contact: any, idx: number) => (
                      <div key={idx} className="duplicate-contact-card">
                        <div className="contact-info">
                          <strong>{contact.name}</strong>
                          <span>{contact.clinic}</span>
                          <span>{contact.specialty}</span>
                          <span>{contact.status}</span>
                          {contact.createdAt && (
                            <span>{new Date(contact.createdAt).toLocaleDateString('pt-BR')}</span>
                          )}
                        </div>
                        {idx === 0 && (
                          <Button
                            size="sm"
                            onClick={() => mergeDuplicates(
                              contact._id || contact.id,
                              group.contacts.slice(1).map((c: any) => c._id || c.id)
                            )}
                          >
                            Manter Este (Mesclar Outros)
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-duplicates">
              <p>✅ Nenhum contato duplicado encontrado!</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Loading States */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Carregando contatos...</div>
        </div>
      )}

      {/* Error States */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <Button onClick={() => fetchContacts(filters)}>
            Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  );
};

// Contact Analytics Component leveraging backend stats
const ContactAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.contacts.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="analytics-loading">Carregando estatísticas...</div>;
  }

  if (!stats) {
    return <div className="analytics-error">Erro ao carregar estatísticas</div>;
  }

  return (
    <div className="contact-analytics">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Contatos</h3>
          <div className="stat-number">{stats.total}</div>
        </div>

        <div className="stat-card">
          <h3>Novos Esta Semana</h3>
          <div className="stat-number">{stats.recentCount}</div>
        </div>

        <div className="stat-card">
          <h3>Taxa de Conversão</h3>
          <div className="stat-number">
            {stats.total > 0 
              ? `${Math.round((stats.byStatus.find((s: any) => s._id === 'converted')?.count || 0) / stats.total * 100)}%`
              : '0%'
            }
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h4>Contatos por Status</h4>
          <div className="status-chart">
            {stats.byStatus.map((item: any) => (
              <div key={item._id} className="chart-bar">
                <span className="bar-label">{item._id}</span>
                <div className="bar-container">
                  <div 
                    className={`bar bar-${item._id}`}
                    style={{ width: `${(item.count / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="bar-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h4>Contatos por Fonte</h4>
          <div className="source-chart">
            {stats.bySource.map((item: any) => (
              <div key={item._id} className="chart-item">
                <span className="source-name">{item._id}</span>
                <span className="source-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {stats.monthlyTrend && stats.monthlyTrend.length > 0 && (
        <div className="trend-section">
          <h4>Tendência Mensal</h4>
          <div className="trend-chart">
            {stats.monthlyTrend.map((item: any) => (
              <div key={item.month} className="trend-item">
                <span className="trend-month">{item.month}</span>
                <span className="trend-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { EnhancedContactList, ContactAnalytics };