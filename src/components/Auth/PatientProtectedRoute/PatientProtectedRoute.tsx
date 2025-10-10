import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePatientAuth } from '../../../contexts/PatientAuthContext';
import Skeleton from '../../UI/Skeleton/Skeleton';

interface PatientProtectedRouteProps {
    children: JSX.Element;
}

const PatientProtectedRoute: React.FC<PatientProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = usePatientAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '2rem',
                    gap: '1.5rem'
                }}
            >
                <Skeleton variant="rectangular" height={40} width="300px" />
                <Skeleton variant="text" lines={3} />
                <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Carregando...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/patient/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PatientProtectedRoute;
