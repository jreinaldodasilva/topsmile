import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <h1>OnDoctor</h1>
        <nav>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#preco">Preço</a></li>
            <li><a href="#recursos">Recursos</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
        <a href="#login" className="login-button">Sou Cliente (Entrar)</a>
      </div>
    </header>
  );
};

export default Header;
