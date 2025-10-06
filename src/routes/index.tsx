// src/routes/index.tsx
import { lazy } from 'react';

// Public routes
export const Home = lazy(() => import('../pages/Home/Home'));
export const FeaturesPage = lazy(() => import('../pages/Features/FeaturesPage'));
export const PricingPage = lazy(() => import('../pages/Pricing/PricingPage'));
export const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));

// Auth routes
export const LoginPage = lazy(() => import('../pages/Login/LoginPage'));
export const RegisterPage = lazy(() => import('../pages/Login/RegisterPage'));
export const ForgotPasswordPage = lazy(() => import('../pages/Login/ForgotPasswordPage'));
export const ResetPasswordPage = lazy(() => import('../pages/Login/ResetPasswordPage'));

// Patient routes
export const PatientLoginPage = lazy(() => import('../pages/Patient/Login/PatientLoginPage'));
export const PatientRegisterPage = lazy(() => import('../pages/Patient/Register/PatientRegisterPage'));
export const PatientDashboard = lazy(() => import('../pages/Patient/Dashboard/PatientDashboard'));
export const PatientAppointmentsList = lazy(() => import('../pages/Patient/Appointment/PatientAppointmentsList'));
export const PatientAppointmentBooking = lazy(() => import('../pages/Patient/Appointment/PatientAppointmentBooking'));
export const PatientAppointmentDetail = lazy(() => import('../pages/Patient/Appointment/PatientAppointmentDetail'));
export const PatientProfile = lazy(() => import('../pages/Patient/Profile/PatientProfile'));

// Admin routes
export const AdminPage = lazy(() => import('../pages/Login/AdminPage'));
export const ContactManagement = lazy(() => import('../pages/Admin/ContactManagement'));
export const PatientManagement = lazy(() => import('../pages/Admin/PatientManagement'));
export const PatientDetail = lazy(() => import('../pages/Admin/PatientDetail'));
export const ProviderManagement = lazy(() => import('../pages/Admin/ProviderManagement'));
export const AppointmentCalendar = lazy(() => import('../pages/Admin/AppointmentCalendar'));

// Utility routes
export const CalendarPage = lazy(() => import('../pages/Calendar/CalendarPage'));
export const FormRendererPage = lazy(() => import('../pages/FormRenderer/FormRendererPage'));
export const TestComponents = lazy(() => import('../pages/TestComponents/TestComponents'));
export const UnauthorizedPage = lazy(() => import('../pages/Unauthorized/UnauthorizedPage'));
