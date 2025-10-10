// src/layouts/DashboardLayout/DashboardLayout.tsx
import React from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">{/* Sidebar navigation */}</aside>
            <div className="dashboard-main">
                <header className="dashboard-header">{/* Header with user menu */}</header>
                <main className="dashboard-content">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
