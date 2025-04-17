import React from 'react';
import './Specialties.css';
import { FaStethoscope, FaPills, FaHeartbeat, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';

type Specialty = {
  icon: any;
  title: string;
  description: string;
};

const specialtiesData: Specialty[] = [
  {
    icon: FaStethoscope,
    title: 'Cardiologia',
    description: 'Cuide da saúde do seu coração com profissionais qualificados.',
  },
  {
    icon: FaPills,
    title: 'Dermatologia',
    description: 'Tratamentos eficazes para a saúde da sua pele.',
  },
  {
    icon: FaHeartbeat,
    title: 'Ginecologia',
    description: 'Atenção especializada à saúde feminina.',
  },
  {
    icon: FaBrain,
    title: 'Neurologia',
    description: 'Diagnóstico e acompanhamento das doenças neurológicas.',
  },
];

const Specialties: React.FC = () => {
  return (
    <section className="specialties" id="specialties">
      <div className="specialties-container">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
        >
          Especialidades
        </motion.h2>

        <div className="specialties-grid">
          {specialtiesData.map((specialty, index) => {
            const Icon = specialty.icon;
            return (
              <motion.div
                className="specialty-card"
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <div className="icon"><Icon /></div>
                <h3>{specialty.title}</h3>
                <p>{specialty.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Specialties;