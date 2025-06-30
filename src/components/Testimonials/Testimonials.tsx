import React from 'react';
import Slider from 'react-slick';
import { FaQuoteLeft } from 'react-icons/fa';
import './Testimonials.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
	{
		name: 'Maria Silva',
		text: 'Fiquei surpresa com a qualidade do atendimento. Prático, rápido e muito eficiente!',
		avatar: '',
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

const QuoteIcon = FaQuoteLeft as unknown as React.FC<{ className?: string }>;

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
		adaptiveHeight: true,
	};

	return (
		<section className="testimonials" id="testimonials">
			<div className="testimonials-container">
				<h2>O que dizem nossos pacientes</h2>
				<Slider {...settings}>
					{testimonials.map((t, index) => (
						<div className="testimonial-card" key={index}>
							<QuoteIcon className="quote-icon" />
							<p className="text">"{t.text}"</p>
							<div className="author">
								<div className="avatar">
									{t.avatar || (
										<span className="avatar-placeholder">
											{t.name[0]}
										</span>
									)}
								</div>
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
