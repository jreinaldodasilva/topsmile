import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {

  const Icon1 = FaFacebookF as any;
  const Icon2 = FaInstagram as any;
  const Icon3 = FaLinkedinIn as any;    

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>OnDoctor</h2>
          <p>Conectando você à saúde de forma simples, rápida e segura.</p>
        </div>

        <div className="footer-links">
          <a href="#home">Início</a>
          <a href="#features">Recursos</a>
          <a href="#specialties">Especialidades</a>
          <a href="#testimonials">Depoimentos</a>
        </div>

        <div className="footer-social">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <Icon1 />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <Icon2 />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <Icon3 />
          </a>


      </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} OnDoctor. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
