import React from 'react';
import './Header.css';
import logo from '../../assets/images/icon-192x192.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Benefícios', href: '#features' },
  { label: 'Preços', href: '#pricing' },
  { label: 'Contato', href: '#contact' },
];

const Header: React.FC = () => (
  <header className="header">
    <div className="container">
      <div className="logo">
        <img src={logo} alt="TopSmile Logo" className="logo-img" />
        <span>TopSmile</span>
      </div>
      <nav className="nav">
        <ul>
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <a href="#cta" className="cta-button">Sou Cliente (Entrar)</a>
    </div>
  </header>
);

export default Header;
