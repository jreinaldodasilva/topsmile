// src/App.tsx
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { preloadCriticalComponents } from './utils/lazyImports';

// Contexts
import { ErrorProvider } from './contexts/ErrorContext';
import { AuthProvider } from './contexts/AuthContext';
import { PatientAuthProvider } from './contexts/PatientAuthContext';

// Error Boundaries
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ApiErrorBoundary from './components/ErrorBoundary/ApiErrorBoundary';

// UI Components
import Loading from './components/UI/Loading/Loading';
import NotificationContainer from './components/Notifications/NotificationContainer';

// Route Protection
import ProtectedRoute from './components/Auth/ProtectedRoute/ProtectedRoute';
import PatientProtectedRoute from './components/Auth/PatientProtectedRoute';

// Lazy-loaded routes
import * as LazyRoutes from './routes';

import './styles/global.css';

const App: React.FC = () => {
  useEffect(() => {
    // Preload critical components after initial render
    preloadCriticalComponents();
  }, []);

  return (
    <ErrorBoundary level="critical" context="app-root">
      <ErrorProvider>
        <QueryProvider>
        <Router>
          <AuthProvider>
            <PatientAuthProvider>
              <ErrorBoundary level="page" context="router">
                <Suspense fallback={<Loading />}>
                  <ApiErrorBoundary>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<ErrorBoundary level="page" context="home-page"><LazyRoutes.Home /></ErrorBoundary>} />
                      <Route path="/features" element={<ErrorBoundary level="page" context="features-page"><LazyRoutes.FeaturesPage /></ErrorBoundary>} />
                      <Route path="/pricing" element={<ErrorBoundary level="page" context="pricing-page"><LazyRoutes.PricingPage /></ErrorBoundary>} />
                      <Route path="/contact" element={<ErrorBoundary level="page" context="contact-page"><LazyRoutes.ContactPage /></ErrorBoundary>} />
                      <Route path="/login" element={<ErrorBoundary level="page" context="login-page"><LazyRoutes.LoginPage /></ErrorBoundary>} />
                      <Route path="/register" element={<ErrorBoundary level="page" context="register-page"><LazyRoutes.RegisterPage /></ErrorBoundary>} />
                      <Route path="/forgot-password" element={<ErrorBoundary level="page" context="forgot-password-page"><LazyRoutes.ForgotPasswordPage /></ErrorBoundary>} />
                      <Route path="/reset-password" element={<ErrorBoundary level="page" context="reset-password-page"><LazyRoutes.ResetPasswordPage /></ErrorBoundary>} />
                      <Route path="/calendar" element={<ErrorBoundary level="page" context="calendar-page"><LazyRoutes.CalendarPage /></ErrorBoundary>} />
                      <Route path="/forms" element={<ErrorBoundary level="page" context="forms-page"><LazyRoutes.FormRendererPage templateId="default" /></ErrorBoundary>} />
                      <Route path="/test-components" element={<ErrorBoundary level="page" context="test-components-page"><LazyRoutes.TestComponents /></ErrorBoundary>} />

                      {/* Patient routes */}
                      <Route path="/patient/login" element={<ErrorBoundary level="page" context="patient-login-page"><LazyRoutes.PatientLoginPage /></ErrorBoundary>} />
                      <Route path="/patient/register" element={<ErrorBoundary level="page" context="patient-register-page"><LazyRoutes.PatientRegisterPage /></ErrorBoundary>} />
                      <Route path="/patient/dashboard" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-dashboard"><LazyRoutes.PatientDashboard /></ErrorBoundary></PatientProtectedRoute>} />
                      <Route path="/patient/appointments" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-appointments"><LazyRoutes.PatientAppointmentsList /></ErrorBoundary></PatientProtectedRoute>} />
                      <Route path="/patient/appointments/new" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-appointment-booking"><LazyRoutes.PatientAppointmentBooking /></ErrorBoundary></PatientProtectedRoute>} />
                      <Route path="/patient/appointments/:id" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-appointment-detail"><LazyRoutes.PatientAppointmentDetail /></ErrorBoundary></PatientProtectedRoute>} />
                      <Route path="/patient/profile" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-profile"><LazyRoutes.PatientProfile /></ErrorBoundary></PatientProtectedRoute>} />

                      {/* Admin routes */}
                      <Route path="/admin" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="admin-dashboard"><LazyRoutes.AdminPage /></ErrorBoundary></ProtectedRoute>} />
                      <Route path="/admin/contacts" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="contact-management"><LazyRoutes.ContactManagement /></ErrorBoundary></ProtectedRoute>} />
                      <Route path="/admin/patients" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist']}><ErrorBoundary level="page" context="patient-management"><LazyRoutes.PatientManagement /></ErrorBoundary></ProtectedRoute>} />
                      <Route path="/admin/providers" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="provider-management"><LazyRoutes.ProviderManagement /></ErrorBoundary></ProtectedRoute>} />
                      <Route path="/admin/appointments" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist', 'assistant']}><ErrorBoundary level="page" context="appointment-management"><LazyRoutes.AppointmentCalendar /></ErrorBoundary></ProtectedRoute>} />
                      <Route path="/admin/billing" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="billing-management"><div style={{ padding: '2rem', textAlign: 'center' }}><h1>Financeiro</h1><p>Em desenvolvimento...</p><button onClick={() => window.location.href = '/admin'}>← Voltar ao Dashboard</button></div></ErrorBoundary></ProtectedRoute>} />

                      {/* Redirect unknown routes */}
                      <Route path="/unauthorized" element={<LazyRoutes.UnauthorizedPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ApiErrorBoundary>
                </Suspense>
              </ErrorBoundary>

              {/* Global notification container */}
              <NotificationContainer />
            </PatientAuthProvider>
          </AuthProvider>
        </Router>
        </QueryProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
};

export default App;
