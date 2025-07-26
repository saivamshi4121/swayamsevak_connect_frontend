import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stats');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { label: 'Create Shakha', path: '/admin/shakhas' },
    { label: 'Create Event', path: '/admin/events' },
    { label: 'Upload Resource', path: '/admin/resources' },
    { label: 'Add Seva Project', path: '/admin/seva' },
  ];

  return (
    <div>
      <h2>Dashboard Overview</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Users</h5>
                  <p className="card-text display-6">{stats.users}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Shakhas</h5>
                  <p className="card-text display-6">{stats.shakhas}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Events</h5>
                  <p className="card-text display-6">{stats.events}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Seva Projects</h5>
                  <p className="card-text display-6">{stats.seva}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Resources</h5>
                  <p className="card-text display-6">{stats.resources}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h5>Quick Actions</h5>
            {quickActions.map(action => (
              <button
                key={action.label}
                className="btn btn-primary me-2 mb-2"
                onClick={() => navigate(action.path)}
              >
                {action.label}
              </button>
            ))}
          </div>
          <div>
            <h5>Recent Activity</h5>
            <ul className="list-group">
              {/* Placeholder for recent activity */}
              <li className="list-group-item">User John registered</li>
              <li className="list-group-item">New event "Yoga Camp" created</li>
              <li className="list-group-item">Resource "Motivational Speech" uploaded</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview; 