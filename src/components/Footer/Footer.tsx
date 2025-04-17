import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>onDoctor</h3>
          <p>Simplificando o acesso à saúde de qualidade, onde você estiver.</p>
        </div>

        <div className="footer-links">
          <h4>Links</h4>
          <ul>
            <li><a href="#hero">Início</a></li>
            <li><a href="#features">Benefícios</a></li>
            <li><a href="#specialties">Especialidades</a></li>
            <li><a href="#testimonials">Depoimentos</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contato</h4>
          <p>Email: contato@ondoctor.app</p>
          <p>Tel: (11) 99999-9999</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} onDoctor. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
