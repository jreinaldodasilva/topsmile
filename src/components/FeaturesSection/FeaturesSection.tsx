import React from 'react';
import FeatureCard from '../FeatureCard/FeatureCard';
import './FeaturesSection.css';

const features = [
  { title: 'Agenda Simples & Call Center', description: 'Organize seu consultório facilmente.' },
  { title: 'Sincronização com Google Agenda', description: 'Mantenha tudo sincronizado.' },
];

const FeaturesSection: React.FC = () => (
  <section id="features" className="features-section">
    <h2 className="features-title">Recursos</h2>
    <div className="features-grid">
      {features.map(f => <FeatureCard key={f.title} {...f} />)}
    </div>
  </section>
);

export default FeaturesSection;
