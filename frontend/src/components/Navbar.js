import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">📄 ResumeBuilder</Link>
      <div className="navbar-right">
        <span className="navbar-user">👤 {user?.name}</span>
        <Link to="/builder" className="btn btn-primary btn-sm">+ New Resume</Link>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
