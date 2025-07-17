import React from 'react';

interface FeatureCardProps { title: string; description: string; }
export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="p-6 border rounded shadow hover:shadow-lg">
    <h3 className="font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);
