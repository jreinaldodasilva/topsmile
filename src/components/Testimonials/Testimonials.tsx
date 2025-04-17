import React from 'react';
import './Testimonials.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination, Autoplay } from 'swiper/modules';

const testimonials = [
  {
    name: 'Ana Costa',
    role: 'Paciente',
    text: 'O atendimento foi excelente! Consegui falar com o médico sem sair de casa.',
    image: '/assets/user1.jpg',
  },
  {
    name: 'Carlos Silva',
    role: 'Paciente',
    text: 'Muito prático. Agendei em minutos e fui atendido com pontualidade.',
    image: '/assets/user2.jpg',
  },
  {
    name: 'Juliana Rocha',
    role: 'Paciente',
    text: 'Me senti segura e acolhida. Recomendo muito o serviço!',
    image: '/assets/user3.jpg',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <h2 className="testimonials-title">Depoimentos de quem usa</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card">
                <img src={t.image} alt={t.name} className="testimonial-img" />
                <p className="testimonial-text">"{t.text}"</p>
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
