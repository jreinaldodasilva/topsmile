import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <div className="container hero-container">
        <div className="hero-text">
          <h1>Consultas médicas online com poucos cliques</h1>
          <p>
            Encontre médicos, agende consultas e receba atendimento de qualidade sem sair de casa.
            Mais saúde, mais conveniência, mais tempo pra você.
          </p>
          <div className="hero-buttons">
            <a href="#signup" className="btn-filled">Criar Conta</a>
            <a href="#demo" className="btn-outline">Ver Demonstração</a>
          </div>
        </div>
        <div className="hero-image">
          {/* Substitua por imagem real depois */}
          <img src="/assets/hero-placeholder.png" alt="Consulta médica online" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
