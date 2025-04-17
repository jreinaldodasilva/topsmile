import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          {/* <img src="/assets/logo.svg" alt="OnDoctor Logo" className="logo-img" /> */}
          <span>onDoctor</span>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#hero">Início</a></li>
            <li><a href="#features">Recursos</a></li>
            <li><a href="#specialties">Especialidades</a></li>
            <li><a href="#testimonials">Depoimentos</a></li>
          </ul>
        </nav>
        <div className="nav-buttons">
          <a href="#demo" className="btn-outline">Ver Demonstração</a>
          <a href="#signup" className="btn-filled">Criar Conta</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
