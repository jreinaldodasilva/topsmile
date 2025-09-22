import { lazy } from 'react';
import type { Patient } from '@topsmile/types';


// Lazy load heavy components to improve initial bundle size
export const LazyContactManagement = lazy(() => import('../pages/Admin/ContactManagement'));

export const LazyCalendarPage = lazy(() => import('../pages/Calendar/CalendarPage'));

export const LazyPatientDashboard = lazy(() => import('../pages/Patient/Dashboard/PatientDashboard'));

export const LazyFormRenderer = lazy(() => import('../pages/FormRenderer/FormRendererPage'));

export const LazyPaymentComponents = lazy(() => import('../components/Payment/PaymentRetryModal'));

// Utility function to preload components
export const preloadComponent = (componentImport: () => Promise<any>) => {
  const componentImportFunc = componentImport;
  componentImportFunc();
};

// Preload critical components after initial render
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  setTimeout(() => {
    preloadComponent(() => import('../pages/Admin/ContactManagement'));
    preloadComponent(() => import('../pages/Calendar/CalendarPage'));
  }, 2000);
};