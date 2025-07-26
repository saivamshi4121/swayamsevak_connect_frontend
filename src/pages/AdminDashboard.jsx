import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <nav className="navbar navbar-light bg-light justify-content-between px-4">
          <span className="navbar-text">
            Welcome, {user?.name} ({user?.email})
          </span>
          <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
        </nav>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 