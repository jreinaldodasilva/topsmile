import React from 'react';
import './Header.css';
import logo from '../../assets/images/icon-192x192.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Benefícios', href: '#features' },
  { label: 'Preços', href: '#pricing' },
  { label: 'Depoimentos', href: '#testimonials' },  
  { label: 'Contato', href: '#contact' },
];

const Header: React.FC = () => (
  <header className="header">
    <div className="container">
      <div className="logo">
        <img src={logo} alt="TopSmile Logo" width={48} height={48} className="logo-img" />
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
      <a href="#cta" className="cta-button">Começar Agora</a>
    </div>
  </header>
);

export default Header;
