import React from 'react';
import './Features.css';

const features = [
  {
    title: 'Agendamento Rápido',
    description: 'Marque sua consulta em poucos cliques, direto do seu celular ou computador.',
    icon: '/assets/icon-agendamento.svg',
  },
  {
    title: 'Médicos Qualificados',
    description: 'Profissionais experientes e especializados prontos para te atender.',
    icon: '/assets/icon-medico.svg',
  },
  {
    title: 'Atendimento Online',
    description: 'Receba atendimento médico no conforto da sua casa, com total segurança.',
    icon: '/assets/icon-online.svg',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="features">
      <div className="container">
        <h2 className="features-title">Por que escolher o onDoctor?</h2>
        <div className="features-list">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <img src={feature.icon} alt={feature.title} className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
