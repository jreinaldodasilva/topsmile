import React from 'react';
import './Header.css';
import logo from '../../assets/images/icon-192x192.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="onDoctor Logo" width={48} height={48} className="logo-img" />
          onDoctor
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#hero">Início</a></li>
            <li><a href="#features">Benefícios</a></li>
            <li><a href="#specialties">Especialidades</a></li>
            <li><a href="#testimonials">Depoimentos</a></li>
          </ul>
        </nav>
        <a href="#cta" className="cta-button">Começar Agora</a>
      </div>
    </header>
  );
};

export default Header;
