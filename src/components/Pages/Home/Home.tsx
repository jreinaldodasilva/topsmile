import React from 'react';
import Header from '../../Header/Header';
import Hero from '../../Hero/Hero';
import FeaturesSection from '../../FeaturesSection/FeaturesSection';
import PricingSection from '../../PricingSection/PricingSection';
import ContactForm from '../../ContactForm/ContactForm';
import Testimonials from '../../Testimonials/Testimonials';
import Footer from '../../Footer/Footer';

const Home: React.FC = () => (
  <div className="font-sans text-gray-800">
    <Header />
    <Hero />
    <FeaturesSection />
    <PricingSection />
    <ContactForm />
    <Testimonials />
    <Footer />
  </div>
);

export default Home;
