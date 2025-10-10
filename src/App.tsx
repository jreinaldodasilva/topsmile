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
import PatientProtectedRoute from './components/Auth/PatientProtectedRoute/PatientProtectedRoute';

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
          <ErrorBoundary level="page" context="router">
            <Suspense fallback={<Loading />}>
              <ApiErrorBoundary>
                <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<ErrorBoundary level="page" context="home-page"><LazyRoutes.Home /></ErrorBoundary>} />
                      <Route path="/features" element={<ErrorBoundary level="page" context="features-page"><LazyRoutes.FeaturesPage /></ErrorBoundary>} />
                      <Route path="/pricing" element={<ErrorBoundary level="page" context="pricing-page"><LazyRoutes.PricingPage /></ErrorBoundary>} />
                      <Route path="/contact" element={<ErrorBoundary level="page" context="contact-page"><LazyRoutes.ContactPage /></ErrorBoundary>} />

                      <Route path="/register" element={<ErrorBoundary level="page" context="register-page"><LazyRoutes.RegisterPage /></ErrorBoundary>} />
                      <Route path="/forgot-password" element={<ErrorBoundary level="page" context="forgot-password-page"><LazyRoutes.ForgotPasswordPage /></ErrorBoundary>} />
                      <Route path="/reset-password" element={<ErrorBoundary level="page" context="reset-password-page"><LazyRoutes.ResetPasswordPage /></ErrorBoundary>} />
                      <Route path="/calendar" element={<ErrorBoundary level="page" context="calendar-page"><LazyRoutes.CalendarPage /></ErrorBoundary>} />
                      <Route path="/forms" element={<ErrorBoundary level="page" context="forms-page"><LazyRoutes.FormRendererPage templateId="default" /></ErrorBoundary>} />
                      <Route path="/test-components" element={<ErrorBoundary level="page" context="test-components-page"><LazyRoutes.TestComponents /></ErrorBoundary>} />

                      {/* Patient routes - wrapped with PatientAuthProvider */}
                      <Route path="/patient/*" element={<PatientAuthProvider><Routes>
                        <Route path="login" element={<ErrorBoundary level="page" context="patient-login-page"><LazyRoutes.PatientLoginPage /></ErrorBoundary>} />
                        <Route path="register" element={<ErrorBoundary level="page" context="patient-register-page"><LazyRoutes.PatientRegisterPage /></ErrorBoundary>} />
                        <Route path="dashboard" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-dashboard"><LazyRoutes.PatientDashboard /></ErrorBoundary></PatientProtectedRoute>} />
                        <Route path="appointments" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-appointments"><LazyRoutes.PatientAppointmentsList /></ErrorBoundary></PatientProtectedRoute>} />
                        <Route path="appointments/new" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-appointment-booking"><LazyRoutes.PatientAppointmentBooking /></ErrorBoundary></PatientProtectedRoute>} />
                        <Route path="appointments/:id" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-appointment-detail"><LazyRoutes.PatientAppointmentDetail /></ErrorBoundary></PatientProtectedRoute>} />
                        <Route path="profile" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-profile"><LazyRoutes.PatientProfile /></ErrorBoundary></PatientProtectedRoute>} />
                        <Route path="medical-records" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-medical-records"><LazyRoutes.PatientMedicalRecords /></ErrorBoundary></PatientProtectedRoute>} />
                        <Route path="prescriptions" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-prescriptions"><LazyRoutes.PatientPrescriptions /></ErrorBoundary></PatientProtectedRoute>} />
                        <Route path="documents" element={<PatientProtectedRoute><ErrorBoundary level="page" context="patient-documents"><LazyRoutes.PatientDocuments /></ErrorBoundary></PatientProtectedRoute>} />
                      </Routes></PatientAuthProvider>} />

                      {/* Admin/Staff routes - wrapped with AuthProvider */}
                      <Route path="/login" element={<AuthProvider><ErrorBoundary level="page" context="login-page"><LazyRoutes.LoginPage /></ErrorBoundary></AuthProvider>} />
                      <Route path="/admin/*" element={<AuthProvider><Routes>
                        <Route index element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="admin-dashboard"><LazyRoutes.AdminPage /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="contacts" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="contact-management"><LazyRoutes.ContactManagement /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="patients" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist']}><ErrorBoundary level="page" context="patient-management"><LazyRoutes.PatientManagement /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="patients/:id" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist']}><ErrorBoundary level="page" context="patient-detail"><LazyRoutes.PatientDetail /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="providers" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="provider-management"><LazyRoutes.ProviderManagement /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="appointments" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist', 'assistant']}><ErrorBoundary level="page" context="appointment-management"><LazyRoutes.AppointmentCalendar /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="operatories" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="operatory-management"><LazyRoutes.OperatoryManagement /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="waitlist" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist', 'assistant']}><ErrorBoundary level="page" context="waitlist-management"><LazyRoutes.WaitlistManagement /></ErrorBoundary></ProtectedRoute>} />
                        <Route path="billing" element={<ProtectedRoute roles={['super_admin', 'admin', 'manager']}><ErrorBoundary level="page" context="billing-management"><div style={{ padding: '2rem', textAlign: 'center' }}><h1>Financeiro</h1><p>Em desenvolvimento...</p><button onClick={() => window.location.href = '/admin'}>← Voltar ao Dashboard</button></div></ErrorBoundary></ProtectedRoute>} />
                      </Routes></AuthProvider>} />

                      {/* Redirect unknown routes */}
                      <Route path="/unauthorized" element={<LazyRoutes.UnauthorizedPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </ApiErrorBoundary>
                </Suspense>
              </ErrorBoundary>

              {/* Global notification container */}
              <NotificationContainer />
        </Router>
        </QueryProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
};

export default App;
