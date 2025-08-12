import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './FeaturesPage.css';

const features = [
  {
    icon: '🗓️',
    title: 'Agendamento Online',
    description: 'Permita que seus pacientes agendem consultas facilmente pela internet, a qualquer hora.',
  },
  {
    icon: '📱',
    title: 'Gestão de Pacientes',
    description: 'Organize informações, histórico e contatos dos pacientes de forma segura e centralizada.',
  },
  {
    icon: '🔔',
    title: 'Lembretes Automáticos',
    description: 'Envie lembretes automáticos por SMS ou WhatsApp para reduzir faltas e atrasos.',
  },
  {
    icon: '💳',
    title: 'Pagamentos Integrados',
    description: 'Receba pagamentos online de forma prática e segura, integrado ao sistema.',
  },
  {
    icon: '📊',
    title: 'Relatórios Inteligentes',
    description: 'Acompanhe indicadores, produtividade e resultados com relatórios visuais e fáceis de entender.',
  },
  {
    icon: '🔒',
    title: 'Segurança de Dados',
    description: 'Proteção total das informações dos pacientes, conforme a LGPD.',
  },
];

const FeaturesPage: React.FC = () => (
  <>
    <Header />
    <main className="features-main">
      <section className="features-hero">
        <h1 className="features-title">Benefícios do TopSmile</h1>
        <p className="features-subtitle">
          Descubra como o TopSmile pode transformar a gestão da sua clínica odontológica.
        </p>
      </section>
      <section className="features-grid-section">
        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default FeaturesPage;