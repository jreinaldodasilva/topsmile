import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content">
          <h2>Sistema para clínicas de multi especialidades</h2>
          <p>
            Junte-se a profissionais da saúde de todo o Brasil e melhore sua gestão com o OnDoctor.
            Ganhe tempo ao organizar sua agenda e economize gerenciando melhor sua clínica com o
            software para controle e gestão mais completo e fácil de usar.
          </p>
          <ul>
            <li>Agenda online</li>
            <li>Prontuário eletrônico</li>
            <li>WhatsApp</li>
            <li>Telemedicina</li>
            <li>Gestão financeira</li>
            <li>+30 recursos</li>
          </ul>
          <div className="hero-buttons">
            <a href="#testar" className="btn-primary">Quero testar agora</a>
            <a href="#planos" className="btn-secondary">Conheça os planos</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="path_to_your_image.jpg" alt="OnDoctor Illustration" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
