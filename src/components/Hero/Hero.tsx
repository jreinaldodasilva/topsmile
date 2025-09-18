import React from 'react';
import './Hero.css';
import { motion } from 'framer-motion';
import heroImage from '../../assets/hero-app-dashboard.png';

const Hero: React.FC = () => (
  <section className="hero" id="hero">
    <div className="hero-content">
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title">
          Transforme sua clínica com um sistema completo e intuitivo
        </h1>
        <p className="hero-subtitle">
          Gestão inteligente de agendamentos, prontuários digitais, controle financeiro e CRM — tudo em um único lugar, seguro e acessível.
        </p>
        <a
          href="#pricing"
          className="hero-button"
        >
          Experimente Gratuitamente
        </a>
      </motion.div>

      <motion.div
        className="hero-image"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src={heroImage}
          alt="Dashboard do sistema de gestão para clínicas"
          className="max-w-full h-auto rounded-lg shadow-xl"
        />
      </motion.div>
    </div>
  </section>
);

export default Hero;
