// src/layouts/PatientPortalLayout/PatientPortalLayout.tsx
import React from 'react';

interface PatientPortalLayoutProps {
    children: React.ReactNode;
}

const PatientPortalLayout: React.FC<PatientPortalLayoutProps> = ({ children }) => {
    return (
        <div className="patient-portal-layout">
            <header className="patient-portal-header">{/* Patient navigation */}</header>
            <main className="patient-portal-content">{children}</main>
        </div>
    );
};

export default PatientPortalLayout;
