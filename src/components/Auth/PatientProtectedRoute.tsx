import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePatientAuth } from '../../contexts/PatientAuthContext';

interface PatientProtectedRouteProps {
  children: JSX.Element;
}

const PatientProtectedRoute: React.FC<PatientProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = usePatientAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/patient/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PatientProtectedRoute;
