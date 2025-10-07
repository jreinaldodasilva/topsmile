import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initPerformanceMonitoring } from './utils/performanceMonitor';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_DISABLE_MSW) {
  const { worker } = require('./mocks/browser');
  worker.start();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

document.documentElement.style.scrollBehavior = 'smooth';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

// Initialize performance monitoring
if (process.env.NODE_ENV === 'production') {
  initPerformanceMonitoring();
}

reportWebVitals();