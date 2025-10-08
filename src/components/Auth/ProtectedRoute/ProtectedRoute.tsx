import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../../contexts/AuthContext';
import Skeleton from '../../UI/Skeleton/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuthState();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '2rem',
        gap: '1.5rem'
      }}>
        <Skeleton variant="rectangular" height={40} width="300px" />
        <Skeleton variant="text" lines={3} />
        <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Carregando...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // role check (if roles provided)
  if (roles && roles.length && user && (user.role && !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
