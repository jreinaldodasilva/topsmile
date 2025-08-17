import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './Dashboard.css';

interface DashboardStats {
  contacts: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    bySource: Array<{ _id: string; count: number }>;
    recentCount: number;
  };
  summary: {
    totalContacts: number;
    newThisWeek: number;
    activeUsers: string;
    revenue: string;
  };
  user: {
    name: string;
    role: string;
    clinicId?: string;
  };
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('topsmile_token');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">Carregando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Erro ao carregar dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1>Dashboard TopSmile</h1>
            <p>Bem-vindo, {user?.name} ({user?.role})</p>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {stats && (
          <>
            <section className="stats-overview">
              <div className="stat-card">
                <h3>Total de Contatos</h3>
                <div className="stat-value">{stats.summary.totalContacts}</div>
              </div>
              <div className="stat-card">
                <h3>Novos esta Semana</h3>
                <div className="stat-value">{stats.summary.newThisWeek}</div>
              </div>
              <div className="stat-card">
                <h3>Taxa de Conversão</h3>
                <div className="stat-value">Em breve</div>
              </div>
              <div className="stat-card">
                <h3>Receita do Mês</h3>
                <div className="stat-value">{stats.summary.revenue}</div>
              </div>
            </section>

            <section className="stats-details">
              <div className="chart-container">
                <h3>Contatos por Status</h3>
                <div className="status-list">
                  {stats.contacts.byStatus.map((item) => (
                    <div key={item._id} className="status-item">
                      <span className="status-name">{item._id}</span>
                      <span className="status-count">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-container">
                <h3>Origem dos Contatos</h3>
                <div className="source-list">
                  {stats.contacts.bySource.map((item) => (
                    <div key={item._id} className="source-item">
                      <span className="source-name">{item._id}</span>
                      <span className="source-count">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="actions-section">
              <h3>Ações Rápidas</h3>
              <div className="action-buttons">
                <button className="action-button primary">
                  Ver Todos os Contatos
                </button>
                <button className="action-button secondary">
                  Gerar Relatório
                </button>
                <button className="action-button secondary">
                  Configurações
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
