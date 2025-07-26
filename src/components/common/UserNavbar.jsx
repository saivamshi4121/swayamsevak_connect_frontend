import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  // Placeholder: Replace with real unread count from notifications state
  const unreadCount = 3;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/user">Swayamsevak Connect</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(v => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`} id="userNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/user" onClick={() => setNavOpen(false)}>Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/user/events" onClick={() => setNavOpen(false)}>Events</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/user/shakha-locator" onClick={() => setNavOpen(false)}>Shakha Locator</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/user/resources" onClick={() => setNavOpen(false)}>Resources</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/user/seva-projects" onClick={() => setNavOpen(false)}>Seva Projects</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/user/badges" onClick={() => setNavOpen(false)}>Badges</Link></li>
            <li className="nav-item position-relative">
              <Link className="nav-link" to="/user/notifications" onClick={() => setNavOpen(false)}>
                <span className="position-relative">
                  <i className="bi bi-bell" style={{fontSize: '1.2rem'}}></i>
                </span>
                <span className="visually-hidden">Notifications</span>
              </Link>
            </li>
            <li className="nav-item"><Link className="nav-link" to="/user/help" onClick={() => setNavOpen(false)}>Help</Link></li>
          </ul>
          <div className="d-flex align-items-center gap-2 position-relative">
            <img
              src="/favicon.ico"
              alt="avatar"
              width={36}
              height={36}
              className="rounded-circle border"
              style={{cursor: 'pointer'}}
              onClick={() => setShowDropdown(v => !v)}
            />
            <span className="fw-semibold text-primary" style={{cursor: 'pointer'}} onClick={() => setShowDropdown(v => !v)}>{user?.name}</span>
            {/* Settings icon */}
            <button
              className="btn btn-link p-0 ms-1"
              style={{lineHeight: 1, fontSize: '1.5rem', color: '#333'}}
              aria-label="Settings"
              onClick={() => { setNavOpen(false); navigate('/user/profile'); }}
            >
              {/* SVG gear icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.94-2.34a1 1 0 0 0 .24-1.1l-1-1.73a1 1 0 0 1 .21-1.23l1.52-1.52a1 1 0 0 0 0-1.41l-2.12-2.12a1 1 0 0 0-1.41 0l-1.52 1.52a1 1 0 0 1-1.23.21l-1.73-1a1 1 0 0 0-1.1.24l-1.06 1.06a1 1 0 0 0-.24 1.1l1 1.73a1 1 0 0 1-.21 1.23l-1.52 1.52a1 1 0 0 0 0 1.41l2.12 2.12a1 1 0 0 0 1.41 0l1.52-1.52a1 1 0 0 1 1.23-.21l1.73 1a1 1 0 0 0 1.1-.24l1.06-1.06z" />
              </svg>
            </button>
            <div className={`dropdown-menu dropdown-menu-end mt-2${showDropdown ? ' show' : ''}`} style={{minWidth: 180, right: 0, left: 'auto'}}>
              <Link className="dropdown-item" to="/user/profile">Profile & Settings</Link>
              <Link className="dropdown-item" to="/user/notifications">Notifications</Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar; 