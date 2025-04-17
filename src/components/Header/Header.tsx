import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">onDoctor</div>
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
