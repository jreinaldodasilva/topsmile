import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home/Home';
import FeaturesPage from './pages/Features/FeaturesPage';
import PricingPage from './pages/Pricing/PricingPage';
import ContactPage from './pages/Contact/ContactPage';


import './styles/global.css';

const App: React.FC = () => (
  <ErrorBoundary>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  </ErrorBoundary>

);

export default App;
