import React from 'react';
import './Hero.css';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Sua saúde na palma da mão</h1>
          <p>Consultas médicas acessíveis, onde e quando você precisar. Fale com profissionais de forma rápida e segura, direto do seu celular.</p>
          <a href="#cta" className="hero-button">Começar Agora</a>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="image-placeholder">
            {/* Substitua por uma imagem real depois */}
            <span>Imagem do app aqui</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
