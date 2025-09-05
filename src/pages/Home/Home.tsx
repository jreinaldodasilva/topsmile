// src/pages/Home/EnhancedHome.tsx
import React, { useState, useEffect } from 'react';
import EnhancedHeader from '../../components/Header/Header';
import Button from '../../components/UI/Button/Button';
import Footer from '../../components/Footer/Footer';
import './Home.css';

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
}

interface Stat {
  label: string;
  value: string;
  description: string;
}

const EnhancedHome: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats: Stat[] = [
    {
      label: 'Consultórios Ativos',
      value: '1,200+',
      description: 'Profissionais confiam no TopSmile'
    },
    {
      label: 'Pacientes Atendidos',
      value: '500K+',
      description: 'Consultas gerenciadas com sucesso'
    },
    {
      label: 'Taxa de Satisfação',
      value: '98%',
      description: 'Aprovação dos nossos usuários'
    },
    {
      label: 'Economia de Tempo',
      value: '70%',
      description: 'Redução no tempo administrativo'
    }
  ];

  const features: Feature[] = [
    {
      id: 'appointments',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      title: 'Agendamento Inteligente',
      description: 'Sistema de agendamento automatizado com confirmações por WhatsApp e lembretes inteligentes.',
      benefits: [
        'Redução de 80% no no-show',
        'Agenda otimizada automaticamente',
        'Integração com WhatsApp',
        'Lembretes personalizáveis'
      ]
    },
    {
      id: 'patients',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      title: 'Gestão de Pacientes',
      description: 'Prontuário eletrônico completo com histórico médico, tratamentos e planos personalizados.',
      benefits: [
        'Prontuário eletrônico completo',
        'Histórico de tratamentos',
        'Planos de tratamento',
        'Controle financeiro integrado'
      ]
    },
    {
      id: 'finance',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: 'Controle Financeiro',
      description: 'Gestão completa do faturamento com relatórios detalhados e controle de inadimplência.',
      benefits: [
        'Faturamento automatizado',
        'Controle de inadimplência',
        'Relatórios financeiros',
        'Integração bancária'
      ]
    },
    {
      id: 'analytics',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3v18h18"/>
          <path d="m19 9-5 5-4-4-3 3"/>
        </svg>
      ),
      title: 'Relatórios e Análises',
      description: 'Dashboard com métricas importantes e relatórios personalizáveis para tomada de decisões.',
      benefits: [
        'Dashboard em tempo real',
        'Métricas de performance',
        'Relatórios personalizados',
        'Análises preditivas'
      ]
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Dr. Ana Carolina Silva',
      role: 'Dentista',
      company: 'Clínica Sorrir Bem',
      content: 'O TopSmile revolucionou minha prática. Economizo 3 horas por dia em tarefas administrativas e meus pacientes adoram os lembretes automáticos.',
      rating: 5
    },
    {
      id: '2',
      name: 'Dr. Roberto Santos',
      role: 'Ortodontista',
      company: 'OrthoCenter',
      content: 'Desde que implementamos o TopSmile, nossa taxa de no-show caiu 85%. O sistema é intuitivo e nossos pacientes se sentem mais cuidados.',
      rating: 5
    },
    {
      id: '3',
      name: 'Dra. Maria Fernanda',
      role: 'Periodontista',
      company: 'Clínica Vida Saudável',
      content: 'A gestão financeira integrada me permitiu identificar oportunidades que aumentaram minha receita em 40% no primeiro ano.',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`testimonial__star ${i < rating ? 'testimonial__star--filled' : ''}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="enhanced-home">
      <EnhancedHeader />
      
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero__background">
          <div className="hero__gradient"></div>
          <div className="hero__pattern"></div>
        </div>
        
        <div className="container">
          <div className="hero__content">
            <div className={`hero__text ${isVisible ? 'hero__text--visible' : ''}`}>
              <h1 className="hero__title">
                Transforme seu
                <span className="hero__title--highlight"> consultório odontológico</span>
                <br />
                em uma experiência digital
              </h1>
              
              <p className="hero__description">
                A plataforma completa para gestão de consultórios odontológicos. 
                Agende consultas, gerencie pacientes e controle suas finanças 
                de forma simples e eficiente.
              </p>
              
              <div className="hero__stats">
                {stats.map((stat, index) => (
                  <div key={index} className="hero__stat">
                    <div className="hero__stat-value">{stat.value}</div>
                    <div className="hero__stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="hero__actions">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.location.href = '/register'}
                >
                  Começar Gratuitamente
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => scrollToSection('demo')}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Ver Demo
                </Button>
              </div>
              
              <div className="hero__trust">
                <p className="hero__trust-text">Confiado por mais de 1.200 profissionais</p>
                <div className="hero__trust-logos">
                  {/* Add customer logos here */}
                  <div className="hero__trust-logo">CRO-SP</div>
                  <div className="hero__trust-logo">CROSP</div>
                  <div className="hero__trust-logo">CFO</div>
                </div>
              </div>
            </div>
            
            <div className={`hero__visual ${isVisible ? 'hero__visual--visible' : ''}`}>
              <div className="hero__dashboard">
                <div className="hero__dashboard-header">
                  <div className="hero__dashboard-controls">
                    <div className="hero__dashboard-dot"></div>
                    <div className="hero__dashboard-dot"></div>
                    <div className="hero__dashboard-dot"></div>
                  </div>
                  <div className="hero__dashboard-title">TopSmile Dashboard</div>
                </div>
                
                <div className="hero__dashboard-content">
                  <div className="hero__dashboard-cards">
                    <div className="hero__dashboard-card hero__dashboard-card--primary">
                      <div className="hero__dashboard-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div className="hero__dashboard-card-content">
                        <div className="hero__dashboard-card-value">1,247</div>
                        <div className="hero__dashboard-card-label">Pacientes</div>
                      </div>
                    </div>
                    
                    <div className="hero__dashboard-card hero__dashboard-card--success">
                      <div className="hero__dashboard-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                      </div>
                      <div className="hero__dashboard-card-content">
                        <div className="hero__dashboard-card-value">24</div>
                        <div className="hero__dashboard-card-label">Consultas Hoje</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hero__dashboard-chart">
                    <div className="hero__dashboard-chart-header">
                      <h4>Receita Mensal</h4>
                      <span className="hero__dashboard-chart-value">R$ 45.680</span>
                    </div>
                    <div className="hero__dashboard-chart-graph">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div 
                          key={i}
                          className="hero__dashboard-chart-bar"
                          style={{ height: `${Math.random() * 60 + 20}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="hero__floating-elements">
                <div className="hero__floating-card hero__floating-card--1">
                  <div className="hero__floating-card-icon">📅</div>
                  <div className="hero__floating-card-text">
                    <div>Nova consulta agendada</div>
                    <small>Maria Silva - 14:30</small>
                  </div>
                </div>
                
                <div className="hero__floating-card hero__floating-card--2">
                  <div className="hero__floating-card-icon">💰</div>
                  <div className="hero__floating-card-text">
                    <div>Pagamento recebido</div>
                    <small>R$ 850,00</small>
                  </div>
                </div>
                
                <div className="hero__floating-card hero__floating-card--3">
                  <div className="hero__floating-card-icon">⭐</div>
                  <div className="hero__floating-card-text">
                    <div>Avaliação 5 estrelas</div>
                    <small>João Santos</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="features__header">
            <h2 className="features__title">
              Tudo que você precisa para gerenciar seu consultório
            </h2>
            <p className="features__description">
              Uma plataforma completa que simplifica sua rotina e melhora a experiência dos seus pacientes
            </p>
          </div>
          
          <div className="features__content">
            <div className="features__nav">
              {features.map((feature, index) => (
                <button
                  key={feature.id}
                  className={`features__nav-item ${activeFeature === index ? 'features__nav-item--active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="features__nav-icon">
                    {feature.icon}
                  </div>
                  <div className="features__nav-content">
                    <h3 className="features__nav-title">{feature.title}</h3>
                    <p className="features__nav-description">{feature.description}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="features__showcase">
              <div className="features__showcase-visual">
                <div className="features__showcase-screen">
                  <div className="features__showcase-content">
                    <h3>{features[activeFeature].title}</h3>
                    <ul className="features__benefits">
                      {features[activeFeature].benefits.map((benefit, index) => (
                        <li key={index} className="features__benefit">
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="testimonials__header">
            <h2 className="testimonials__title">
              O que nossos clientes dizem
            </h2>
            <p className="testimonials__description">
              Histórias reais de profissionais que transformaram seus consultórios
            </p>
          </div>
          
          <div className="testimonials__grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial">
                <div className="testimonial__content">
                  <div className="testimonial__rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <blockquote className="testimonial__quote">
                    "{testimonial.content}"
                  </blockquote>
                </div>
                
                <div className="testimonial__author">
                  <div className="testimonial__avatar">
                    {testimonial.avatar ? (
                      <img src={testimonial.avatar} alt="" />
                    ) : (
                      <div className="testimonial__avatar-placeholder">
                        {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="testimonial__info">
                    <div className="testimonial__name">{testimonial.name}</div>
                    <div className="testimonial__role">{testimonial.role}</div>
                    <div className="testimonial__company">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="cta">
        <div className="container">
          <div className="cta__content">
            <h2 className="cta__title">
              Pronto para transformar seu consultório?
            </h2>
            <p className="cta__description">
              Junte-se a mais de 1.200 profissionais que já revolucionaram sua prática odontológica
            </p>
            
            <div className="cta__actions">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => window.location.href = '/register'}
              >
                Começar Teste Gratuito
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              
              <div className="cta__guarantee">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>30 dias grátis • Sem cartão de crédito • Cancelamento gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EnhancedHome;