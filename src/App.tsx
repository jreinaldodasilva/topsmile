// src/App.tsx - Updated with Enhanced Error Handling
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const queryClient = new QueryClient();

const App: React.FC = () => (
  <ErrorBoundary level="critical" context="app-root">
    <ErrorProvider>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ErrorProvider>
  </ErrorBoundary>
);
export default App;
