// src/App.tsx - Updated with Contact Management Routes
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute/ProtectedRoute';
import CalendarPage from "./pages/Calendar/CalendarPage";
import FormRendererPage from "./pages/FormRenderer/FormRendererPage";
import './styles/global.css';

// Simple Loading component
const Loading: React.FC = () => (
  <div role="status" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <span style={{ fontSize: '1.2rem' }}>Loading...</span>
  </div>
);

// Public pages
const Home = React.lazy(() => import('./pages/Home/Home'));
const FeaturesPage = React.lazy(() => import('./pages/Features/FeaturesPage'));
const PricingPage = React.lazy(() => import('./pages/Pricing/PricingPage'));
const ContactPage = React.lazy(() => import('./pages/Contact/ContactPage'));
const LoginPage = React.lazy(() => import('./pages/Login/LoginPage'));

// Admin pages
const AdminPage = React.lazy(() => import('./pages/Login/AdminPage'));
const ContactManagement = React.lazy(() => import('./pages/Admin/ContactManagement'));

const App: React.FC = () => (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/forms" element={<FormRendererPage templateId="default" />} />

            {/* Protected admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
                  <ContactManagement />
                </ProtectedRoute>
              }
            />

            {/* Future admin routes can be added here */}
            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist']}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Gestão de Pacientes</h1>
                    <p>Em desenvolvimento...</p>
                    <button onClick={() => window.location.href = '/admin'}>
                      ← Voltar ao Dashboard
                    </button>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute roles={['super_admin', 'admin', 'manager', 'dentist', 'assistant']}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Agendamentos</h1>
                    <p>Em desenvolvimento...</p>
                    <button onClick={() => window.location.href = '/admin'}>
                      ← Voltar ao Dashboard
                    </button>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/billing"
              element={
                <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>Financeiro</h1>
                    <p>Em desenvolvimento...</p>
                    <button onClick={() => window.location.href = '/admin'}>
                      ← Voltar ao Dashboard
                    </button>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
);

export default App;