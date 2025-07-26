import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile && (
        <button
          className="sidebar-toggle d-lg-none"
          aria-label="Open sidebar"
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1101,
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px 0 rgba(31,38,135,0.08)',
            fontSize: '1.5rem',
          }}
          onClick={() => setOpen(true)}
        >
          <span style={{display:'block',width:'1.5rem',height:'1.5rem'}}>
            <span style={{display:'block',height:'3px',background:'#333',margin:'4px 0',borderRadius:'2px'}}></span>
            <span style={{display:'block',height:'3px',background:'#333',margin:'4px 0',borderRadius:'2px'}}></span>
            <span style={{display:'block',height:'3px',background:'#333',margin:'4px 0',borderRadius:'2px'}}></span>
          </span>
        </button>
      )}
      {(!isMobile || open) && (
        <div
          className={`d-flex flex-column flex-shrink-0 p-3 bg-light admin-sidebar${open ? ' open' : ''}`}
          style={{ minHeight: '100vh', width: 220, position: isMobile ? 'fixed' : undefined, zIndex: isMobile ? 1050 : undefined }}
        >
          <span className="fs-4 mb-4">Admin Panel</span>
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <NavLink to="/admin" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Dashboard</NavLink>
            </li>
            <li><NavLink to="/admin/shakhas" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Shakha Management</NavLink></li>
            <li><NavLink to="/admin/events" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Event Management</NavLink></li>
            <li><NavLink to="/admin/resources" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Resource Library</NavLink></li>
            <li><NavLink to="/admin/seva" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Seva Projects</NavLink></li>
            <li><NavLink to="/admin/users" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>User Management</NavLink></li>
            <li><NavLink to="/admin/leaderboard" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Badges & Leaderboards</NavLink></li>
            <li><NavLink to="/admin/notifications" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Notifications</NavLink></li>
            <li><NavLink to="/admin/settings" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Settings</NavLink></li>
            <li><NavLink to="/admin/help-requests" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Help Requests</NavLink></li>
          </ul>
          {/* Close button for sidebar on mobile */}
          {isMobile && (
            <button
              className="sidebar-toggle d-lg-none"
              aria-label="Close sidebar"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '-2.5rem',
                zIndex: 1101,
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px 0 rgba(31,38,135,0.08)',
                fontSize: '1.5rem',
              }}
              onClick={() => setOpen(false)}
            >
              <span style={{display:'block',width:'1.5rem',height:'1.5rem',position:'relative'}}>
                <span style={{position:'absolute',top:'50%',left:'0',width:'100%',height:'3px',background:'#333',borderRadius:'2px',transform:'rotate(45deg)'}}></span>
                <span style={{position:'absolute',top:'50%',left:'0',width:'100%',height:'3px',background:'#333',borderRadius:'2px',transform:'rotate(-45deg)'}}></span>
              </span>
            </button>
          )}
        </div>
      )}
      {/* Overlay to close sidebar on mobile */}
      {isMobile && open && <div className="admin-content-overlay" onClick={() => setOpen(false)} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.2)',zIndex:1040}}></div>}
    </>
  );
};

export default Sidebar; 