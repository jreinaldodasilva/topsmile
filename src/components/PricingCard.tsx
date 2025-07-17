import React from 'react';

interface PricingCardProps { title: string; price: string; features: string[]; }
export const PricingCard: React.FC<PricingCardProps> = ({ title, price, features }) => (
  <div className="p-6 border rounded shadow hover:shadow-lg">
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p className="text-4xl font-bold mb-4">R${price}</p>
    <ul className="mb-6 list-disc list-inside">
      {features.map(f => <li key={f}>{f}</li>)}
    </ul>
    <button className="px-4 py-2 bg-blue-600 text-white rounded">Começar</button>
  </div>
);
