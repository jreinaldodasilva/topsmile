import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingSection from './components/PricingSection/PricingSection';
import ContactForm from './components/ContactForm/ContactForm';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import './styles/global.css';

const App: React.FC = () => (
  <Router>
    <div className="font-sans text-gray-800">
      <Header />
      <Hero />
      <FeaturesSection />
      <PricingSection />
      <ContactForm />
      <Testimonials />
      <Footer />
    </div>
  </Router>
);

export default App;
