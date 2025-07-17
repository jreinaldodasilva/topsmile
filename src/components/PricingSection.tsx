import React from 'react';
import { PricingCard } from './PricingCard';

const tiers = [
  {
    title: 'Consultório',
    price: '29,90',
    features: ['1 usuário/mês', 'Agendamento', 'Prontuário eletrônico'],
  },
];

export const PricingSection: React.FC = () => (
  <section id="pricing" className="py-16 bg-blue-50">
    <h2 className="text-3xl font-bold text-center mb-12">Preços</h2>
    <div className="flex justify-center">
      {tiers.map((t) => (
        <PricingCard key={t.title} {...t} />
      ))}
    </div>
  </section>
);
