import React from 'react';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <h3>O que dizem nossos clientes</h3>
        <blockquote>
          “O OnDoctor transformou a maneira como gerenciamos nossa clínica. Simples e completo!”
        </blockquote>
        <cite>- Dr. João Silva</cite>
      </div>
    </section>
  );
};

export default Testimonials;
