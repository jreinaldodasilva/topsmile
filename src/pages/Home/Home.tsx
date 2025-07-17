import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={0}
      >

      </motion.div>

    </>
  );
};

export default Home;
