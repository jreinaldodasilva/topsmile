import React from 'react';
import Slider from 'react-slick';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const testimonials = [
    {
      quote: "O OnDoctor transformou a maneira como gerenciamos nossa clínica. Simples e completo!",
      author: "Dr. João Silva",
    },
    {
      quote: "Excelente suporte e uma plataforma muito intuitiva.",
      author: "Dra. Mariana Lopes",
    },
    {
      quote: "Com o OnDoctor, organizamos melhor os atendimentos e a equipe ganhou produtividade.",
      author: "Clínica Vida",
    },
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <h3>O que dizem nossos clientes</h3>
        <Slider {...settings}>
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-slide">
              <blockquote>“{t.quote}”</blockquote>
              <cite>— {t.author}</cite>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
