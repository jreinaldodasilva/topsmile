import React from 'react';
import './Specialties.css';

const specialties = [
  { name: 'Clínico Geral', icon: '/assets/spec-clinico.svg' },
  { name: 'Dermatologia', icon: '/assets/spec-dermato.svg' },
  { name: 'Pediatria', icon: '/assets/spec-pediatria.svg' },
  { name: 'Ginecologia', icon: '/assets/spec-gineco.svg' },
  { name: 'Psiquiatria', icon: '/assets/spec-psiquiatria.svg' },
  { name: 'Cardiologia', icon: '/assets/spec-cardiologia.svg' },
];

const Specialties: React.FC = () => {
  return (
    <section id="specialties" className="specialties">
      <div className="container">
        <h2 className="specialties-title">Especialidades disponíveis</h2>
        <div className="specialties-grid">
          {specialties.map((spec, index) => (
            <div className="specialty-card" key={index}>
              <img src={spec.icon} alt={spec.name} />
              <span>{spec.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Specialties;
