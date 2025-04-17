import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import Specialties from '../../components/Specialties/Specialties';
import Testimonials from '../../components/Testimonials/Testimonials';
import Footer from '../../components/Footer/Footer';
import { motion } from 'framer-motion';



const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
      >
        <Hero />
      </motion.div>

      <motion.div variants={fadeInUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Features />
      </motion.div>

      <motion.div variants={fadeInUp} custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Specialties />
      </motion.div>

      <motion.div variants={fadeInUp} custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <Testimonials />
      </motion.div>

      <Footer />
    </>
  );
};

export default Home;
