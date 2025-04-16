import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Specialties from './components/Specialties/Specialties';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import './styles/global.css';

function App() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Specialties />
      <Testimonials />
      <Footer />
    </>
  );
}

export default App;
