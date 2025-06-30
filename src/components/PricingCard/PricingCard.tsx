import React from 'react';
import './PricingCard.css';

interface PricingCardProps { title: string; price: string; features: string[]; }
const PricingCard: React.FC<PricingCardProps> = ({ title, price, features }) => (
  <div className="pricing-card">
    <h3 className="pricing-title">{title}</h3>
    <p className="pricing-price">R${price}</p>
    <ul className="pricing-features">
      {features.map(f => <li key={f}>{f}</li>)}
    </ul>
    <button className="pricing-btn">Começar</button>
  </div>
);

export default PricingCard;
