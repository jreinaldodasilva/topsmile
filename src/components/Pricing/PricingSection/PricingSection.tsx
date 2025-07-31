import React from 'react';
import PricingCard from '../PricingCard/PricingCard';
import './PricingSection.css';

const tiers = [{
  title: 'Consultório',
  price: '29,90',
  features: ['1 usuário/mês', 'Agendamento', 'Prontuário eletrônico'],
}];

const PricingSection: React.FC = () => (
  <section id="pricing" className="pricing-section">
    <h2 className="pricing-title">Preços</h2>
    <div className="pricing-grid">
      {tiers.map(t => <PricingCard key={t.title} {...t} />)}
    </div>
  </section>
);

export default PricingSection;
