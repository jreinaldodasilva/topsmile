import React from 'react';
import { FeatureCard } from './FeatureCard';

const features = [
  { title: 'Agenda Simples & Call Center', description: 'Organize seu consultório facilmente.' },
  { title: 'Sincronização com Google Agenda', description: 'Mantenha tudo sincronizado.' },
];

export const FeaturesSection: React.FC = () => (
  <section id="features" className="py-16 bg-white">
    <h2 className="text-3xl font-bold text-center mb-12">Recursos</h2>
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {features.map(f => <FeatureCard key={f.title} {...f} />)}
    </div>
  </section>
);
