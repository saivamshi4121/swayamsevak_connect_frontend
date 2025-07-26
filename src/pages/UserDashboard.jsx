import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold">Welcome, {user?.name}!</h2>
        <div className="text-muted">Role: {user?.role}</div>
      </div>
      <div className="row g-4">
        {/* 1. Overview */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Your Activity Overview</h5>
              <p className="card-text text-muted">Quick stats: events attended, badges, recent contributions.</p>
            </div>
          </div>
        </div>
        {/* 2. Upcoming Events */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Upcoming & Recommended Events</h5>
              <p className="card-text text-muted">See upcoming shakha events and RSVP. Recommendations just for you.</p>
            </div>
          </div>
        </div>
        {/* 3. Shakha Locator */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Shakha Locator & Membership</h5>
              <p className="card-text text-muted">Find nearby shakhas, join/leave, and see your membership status.</p>
            </div>
          </div>
        </div>
        {/* 4. Resource Center */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Resource Center</h5>
              <p className="card-text text-muted">Access new and popular baudhik resources. Search and filter easily.</p>
            </div>
          </div>
        </div>
        {/* 5. Badges & Leaderboards */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Badges & Leaderboards</h5>
              <p className="card-text text-muted">See your badges, progress, and rank. Get motivated to participate!</p>
            </div>
          </div>
        </div>
        {/* 6. Seva Projects */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Seva Projects</h5>
              <p className="card-text text-muted">Track your seva projects, join new ones, and see progress updates.</p>
            </div>
          </div>
        </div>
        {/* 7. Community Activity Feed */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Community Activity Feed</h5>
              <p className="card-text text-muted">See recent posts, discussions, and announcements. Engage with your community.</p>
            </div>
          </div>
        </div>
        {/* 8. Notifications & Messages */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Notifications & Messages</h5>
              <p className="card-text text-muted">Stay updated with alerts, messages, and reminders from your shakha and admins.</p>
            </div>
          </div>
        </div>
        {/* 9. Profile & Settings */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Profile & Settings</h5>
              <p className="card-text text-muted">View and update your profile, contact info, and preferences.</p>
            </div>
          </div>
        </div>
        {/* 10. Help & Support */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Help & Support</h5>
              <p className="card-text text-muted">FAQs, guides, and contact support for any help you need.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 