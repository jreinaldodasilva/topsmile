import React from 'react';
import Slider from 'react-slick';
import './Testimonials.css';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Maria Silva',
    text: 'Fiquei surpresa com a qualidade do atendimento. Prático, rápido e muito eficiente!',
    avatar: '', // Deixe em branco ou adicione imagem futura
  },
  {
    name: 'João Oliveira',
    text: 'Consegui falar com um especialista em poucos minutos. Recomendo muito!',
    avatar: '',
  },
  {
    name: 'Carla Souza',
    text: 'O sistema é simples de usar e os profissionais são ótimos. Salvou minha semana!',
    avatar: '',
  },
];

const Testimonials: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const Icon = FaQuoteLeft as any;
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <h2>O que dizem nossos pacientes</h2>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div className="testimonial-card" key={index}>
              <Icon className="quote-icon" />
              <p className="text">"{t.text}"</p>
              <div className="author">
                <div className="avatar">{t.avatar || <span className="avatar-placeholder">{t.name[0]}</span>}</div>
                <h4>{t.name}</h4>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
