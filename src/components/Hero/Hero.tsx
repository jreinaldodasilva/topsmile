import React from 'react';
import './Hero.css';
import { motion } from 'framer-motion';

const Hero: React.FC = () => (
  <section className="hero" id="hero">
    <div className="hero-content">
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4">Sistema completo para gestão de clínicas</h1>
        <p className="mb-6">Agendamento, prontuários, financeiro, CRM — tudo num só lugar.</p>
        <a href="#pricing" className="hero-button px-6 py-3 bg-blue-600 text-white rounded">Começar Agora</a>
      </motion.div>
      <motion.div
        className="hero-image"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="image-placeholder">
          <span>Imagem do app aqui</span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
