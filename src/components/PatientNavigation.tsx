import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatientAuth } from '../contexts/PatientAuthContext';
import './PatientNavigation.css';

interface PatientNavigationProps {
  activePage?: string;
}

const PatientNavigation: React.FC<PatientNavigationProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { patientUser, logout } = usePatientAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getActivePage = () => {
    if (activePage) return activePage;

    const path = location.pathname;
    if (path === '/patient/dashboard') return 'dashboard';
    if (path === '/patient/appointments' || path.startsWith('/patient/appointments/')) return 'appointments';
    if (path === '/patient/profile') return 'profile';
    return '';
  };

  const currentActivePage = getActivePage();

  const navigationLinks = (
    <>
      <button
        className={`nav-link ${currentActivePage === 'dashboard' ? 'active' : ''}`}
        onClick={() => navigate('/patient/dashboard')}
        aria-label="Ir para o Dashboard"
        aria-current={currentActivePage === 'dashboard' ? 'page' : undefined}
      >
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
        Dashboard
      </button>

      <button
        className={`nav-link ${currentActivePage === 'appointments' ? 'active' : ''}`}
        onClick={() => navigate('/patient/appointments')}
        aria-label="Ir para Consultas"
        aria-current={currentActivePage === 'appointments' ? 'page' : undefined}
      >
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Consultas
      </button>

      <button
        className={`nav-link ${currentActivePage === 'profile' ? 'active' : ''}`}
        onClick={() => navigate('/patient/profile')}
        aria-label="Ir para o Perfil"
        aria-current={currentActivePage === 'profile' ? 'page' : undefined}
      >
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Perfil
      </button>
    </>
  );

  return (
    <nav className="patient-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>TopSmile</h2>
          <span className="nav-subtitle">Portal do Paciente</span>
        </div>

        <div className="nav-links">
          {navigationLinks}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">
              Olá, {patientUser?.patient?.name?.split(' ')[0] || 'Paciente'}
            </span>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sair"
            aria-label="Sair do sistema"
          >
            <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          <svg className="hamburger-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="nav-links-mobile">
          {navigationLinks}
        </div>
      )}
    </nav>
  );
};

export default PatientNavigation;
