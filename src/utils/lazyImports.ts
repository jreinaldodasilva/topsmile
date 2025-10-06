// src/utils/lazyImports.ts
export const preloadComponent = (componentImport: () => Promise<any>) => {
  componentImport();
};

export const preloadCriticalComponents = () => {
  setTimeout(() => {
    preloadComponent(() => import('../pages/Login/LoginPage'));
    preloadComponent(() => import('../pages/Patient/Login/PatientLoginPage'));
  }, 2000);
};

export const preloadAdminComponents = () => {
  preloadComponent(() => import('../pages/Admin/ContactManagement'));
  preloadComponent(() => import('../pages/Admin/PatientManagement'));
  preloadComponent(() => import('../pages/Admin/AppointmentCalendar'));
};

export const preloadPatientComponents = () => {
  preloadComponent(() => import('../pages/Patient/Dashboard/PatientDashboard'));
  preloadComponent(() => import('../pages/Patient/Appointment/PatientAppointmentsList'));
  preloadComponent(() => import('../pages/Patient/Appointment/PatientAppointmentBooking'));
};