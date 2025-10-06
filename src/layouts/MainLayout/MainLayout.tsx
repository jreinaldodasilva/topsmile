// src/layouts/MainLayout/MainLayout.tsx
import React from 'react';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="main-layout">
            <header className="main-header">
                {/* Header content */}
            </header>
            <main className="main-content">
                {children}
            </main>
            <footer className="main-footer">
                {/* Footer content */}
            </footer>
        </div>
    );
};

export default MainLayout;
