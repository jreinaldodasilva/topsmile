import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} OnDoctor. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
