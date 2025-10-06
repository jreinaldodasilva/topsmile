import React from 'react';
import { useNavigate } from 'react-router-dom';
import EnhancedHeader from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Dashboard from '../../components/Admin/Dashboard/Dashboard';
import { useAuthState, useAuthActions } from '../../contexts/AuthContext';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-page">
      <EnhancedHeader 
        user={user ? { name: user.name || user.email, role: user.role } : undefined}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        <div className="container">
          <Dashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
