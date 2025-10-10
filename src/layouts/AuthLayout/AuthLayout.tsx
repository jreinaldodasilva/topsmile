// src/layouts/AuthLayout/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="auth-layout">
            <div className="auth-container">
                <div className="auth-logo">{/* Logo */}</div>
                <div className="auth-content">{children}</div>
            </div>
        </div>
    );
};

export default AuthLayout;
