import React from 'react';
import './Features.css';
import { FaUserMd, FaMobileAlt, FaShieldAlt, FaWallet } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { motion } from 'framer-motion';

type Feature = {
  icon: any;
  title: string;
  description: string;
};

const featuresData: Feature[] = [
  {
    icon: FaUserMd,
    title: 'Consultas com médicos qualificados',
    description: 'Profissionais prontos para atender você com excelência e empatia.',
  },
  {
    icon: FaMobileAlt,
    title: 'Atendimento 100% online',
    description: 'Realize consultas de qualquer lugar com seu celular ou computador.',
  },
  {
    icon: FaShieldAlt,
    title: 'Segurança e privacidade',
    description: 'Seus dados protegidos com tecnologia de ponta.',
  },
  {
    icon: FaWallet,
    title: 'Preço acessível',
    description: 'Serviços de saúde com valores que cabem no seu bolso.',
  },
];

const Features: React.FC = () => {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          Benefícios para você
        </motion.h2>

        <div className="features-grid">
          {featuresData.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                className="feature-card"
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <div className="icon"><Icon /></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;