import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/images/icon-192x192.png';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Benefícios', to: '/features' },
  { label: 'Preços', to: '/pricing' },
  { label: 'Contato', to: '/contact' },
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
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <a href="#cta" className="cta-button">Sou Cliente (Entrar)</a>
    </div>
  </header>
);

export default Header;