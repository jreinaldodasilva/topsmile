// src/App.tsx - Updated with Enhanced Error Handling
import React, { Suspense, lazy, useEffect } from 'react';
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

import './styles/global.css';

const Home = lazy(() => import('./pages/Home/Home'));
const FeaturesPage = lazy(() => import('./pages/Features/FeaturesPage'));
const PricingPage = lazy(() => import('./pages/Pricing/PricingPage'));
const ContactPage = lazy(() => import('./pages/Contact/ContactPage'));
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Login/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Login/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/Login/ResetPasswordPage'));
const CalendarPage = lazy(() => import('./pages/Calendar/CalendarPage'));
const FormRendererPage = lazy(() => import('./pages/FormRenderer/FormRendererPage'));
const TestComponents = lazy(() => import('./pages/TestComponents/TestComponents'));
const PatientLoginPage = lazy(() => import('./pages/Patient/Login/PatientLoginPage'));
const PatientRegisterPage = lazy(() => import('./pages/Patient/Register/PatientRegisterPage'));
const PatientDashboard = lazy(() => import('./pages/Patient/Dashboard/PatientDashboard'));
const PatientAppointmentsList = lazy(() => import('./pages/Patient/Appointment/PatientAppointmentsList'));
const PatientAppointmentBooking = lazy(() => import('./pages/Patient/Appointment/PatientAppointmentBooking'));
const PatientAppointmentDetail = lazy(() => import('./pages/Patient/Appointment/PatientAppointmentDetail'));
const PatientProfile = lazy(() => import('./pages/Patient/Profile/PatientProfile'));
const AdminPage = lazy(() => import('./pages/Login/AdminPage'));
const ContactManagement = lazy(() => import('./pages/Admin/ContactManagement'));
const PatientManagement = lazy(() => import('./pages/Admin/PatientManagement'));
const ProviderManagement = lazy(() => import('./pages/Admin/ProviderManagement'));
const AppointmentCalendar = lazy(() => import('./pages/Admin/AppointmentCalendar'));
const UnauthorizedPage = lazy(() => import('./pages/Unauthorized/UnauthorizedPage'));

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
                      <Route
                        path="/"
                        element={
                          <ErrorBoundary level="page" context="home-page">
                            <Home />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/features"
                        element={
                          <ErrorBoundary level="page" context="features-page">
                            <FeaturesPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/pricing"
                        element={
                          <ErrorBoundary level="page" context="pricing-page">
                            <PricingPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/contact"
                        element={
                          <ErrorBoundary level="page" context="contact-page">
                            <ContactPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <ErrorBoundary level="page" context="login-page">
                            <LoginPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <ErrorBoundary level="page" context="register-page">
                            <RegisterPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/forgot-password"
                        element={
                          <ErrorBoundary level="page" context="forgot-password-page">
                            <ForgotPasswordPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/reset-password"
                        element={
                          <ErrorBoundary level="page" context="reset-password-page">
                            <ResetPasswordPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/calendar"
                        element={
                          <ErrorBoundary level="page" context="calendar-page">
                            <CalendarPage />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/forms"
                        element={
                          <ErrorBoundary level="page" context="forms-page">
                            <FormRendererPage templateId="default" />
                          </ErrorBoundary>
                        }
                      />
                      <Route
                        path="/test-components"
                        element={
                          <ErrorBoundary level="page" context="test-components-page">
                            <TestComponents />
                          </ErrorBoundary>
                        }
                      />

                      {/* Patient routes */}
                      <Route
                        path="/patient/login"
                        element={
                          <ErrorBoundary level="page" context="patient-login-page">
                            <PatientLoginPage />
                          </ErrorBoundary>
                        }
                      />

                      <Route
                        path="/patient/register"
                        element={
                          <ErrorBoundary level="page" context="patient-register-page">
                            <PatientRegisterPage />
                          </ErrorBoundary>
                        }
                      />

                      <Route
                        path="/patient/dashboard"
                        element={
                          <PatientProtectedRoute>
                            <ErrorBoundary level="page" context="patient-dashboard">
                              <PatientDashboard />
                            </ErrorBoundary>
                          </PatientProtectedRoute>
                        }
                      />

                      <Route
                        path="/patient/appointments"
                        element={
                          <PatientProtectedRoute>
                            <ErrorBoundary level="page" context="patient-appointments">
                              <PatientAppointmentsList />
                            </ErrorBoundary>
                          </PatientProtectedRoute>
                        }
                      />

                      <Route
                        path="/patient/appointments/new"
                        element={
                          <PatientProtectedRoute>
                            <ErrorBoundary level="page" context="patient-appointment-booking">
                              <PatientAppointmentBooking />
                            </ErrorBoundary>
                          </PatientProtectedRoute>
                        }
                      />

                      {/* Protected admin routes */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
                            <ErrorBoundary level="page" context="admin-dashboard">
                              <AdminPage />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/admin/contacts"
                        element={
                          <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
                            <ErrorBoundary level="page" context="contact-management">
                              <ContactManagement />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        }
                      />

                      {/* Enhanced admin routes */}
                      <Route
                        path="/admin/patients"
                        element={
                          <ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist']}>
                            <ErrorBoundary level="page" context="patient-management">
                              <PatientManagement />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/admin/providers"
                        element={
                          <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
                            <ErrorBoundary level="page" context="provider-management">
                              <ProviderManagement />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/admin/appointments"
                        element={
                          <ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist', 'assistant']}>
                            <ErrorBoundary level="page" context="appointment-management">
                              <AppointmentCalendar />
                            </ErrorBoundary>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/admin/billing"
                        element={
                          <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
                            <ErrorBoundary level="page" context="billing-management">
                              <div style={{ padding: '2rem', textAlign: 'center' }}>
                                <h1>Financeiro</h1>
                                <p>Em desenvolvimento...</p>
                                <button onClick={() => window.location.href = '/admin'}>
                                  ← Voltar ao Dashboard
                                </button>
                              </div>
                            </ErrorBoundary>
                          </ProtectedRoute>
                      }
                    />

                      <Route
                        path="/patient/appointments/:id"
                        element={
                          <PatientProtectedRoute>
                            <ErrorBoundary level="page" context="patient-appointment-detail">
                              <PatientAppointmentDetail />
                            </ErrorBoundary>
                          </PatientProtectedRoute>
                        }
                      />

                      <Route
                        path="/patient/profile"
                        element={
                          <PatientProtectedRoute>
                            <ErrorBoundary level="page" context="patient-profile">
                              <PatientProfile />
                            </ErrorBoundary>
                          </PatientProtectedRoute>
                        }
                      />

                      {/* Redirect unknown routes */}
                      <Route path="/unauthorized" element={<UnauthorizedPage />} />
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
