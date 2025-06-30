import React from 'react';
import './FeatureCard.css';

interface FeatureCardProps { title: string; description: string; }
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="feature-card">
    <h3 className="feature-title">{title}</h3>
    <p className="feature-desc">{description}</p>
  </div>
);

export default FeatureCard;
