import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [health, setHealth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;
    const fetchAll = async () => {
      try {
        const [statsRes, analyticsRes, healthRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/analytics/overview'),
          api.get('/health'),
        ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
        setHealth(healthRes.data);
        setLoading(false);
        setError('');
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchAll();
    // Poll every 30s for near-real-time updates
    intervalId = setInterval(fetchAll, 30000);
    return () => clearInterval(intervalId);
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
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">Platform Analytics</h5>
                  {!analytics ? (
                    <div>Loading analytics...</div>
                  ) : (
                    <div className="row">
                      <div className="col-md-3">
                        <h6 className="text-muted">Traffic Overview</h6>
                        <ul className="list-unstyled mb-0">
                          <li>Active Users (RT): <strong>{analytics.realtime?.activeUsers ?? 0}</strong></li>
                          <li>Users Today: <strong>{analytics.trafficToday?.users ?? 0}</strong></li>
                          <li>New Users Today: <strong>{analytics.trafficToday?.newUsers ?? 0}</strong></li>
                          <li>Sessions Today: <strong>{analytics.trafficToday?.sessions ?? 0}</strong></li>
                        </ul>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">7-day Traffic</h6>
                        <ul className="list-unstyled mb-0">
                          <li>Users: <strong>{analytics.traffic7d?.users ?? 0}</strong></li>
                          <li>New Users: <strong>{analytics.traffic7d?.newUsers ?? 0}</strong></li>
                          <li>Sessions: <strong>{analytics.traffic7d?.sessions ?? 0}</strong></li>
                        </ul>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">Performance Metrics</h6>
                        <ul className="list-unstyled mb-0">
                          <li>Avg Session (s): <strong>{analytics.engagement7d?.averageSessionDuration?.toFixed ? Number(analytics.engagement7d.averageSessionDuration).toFixed(1) : analytics.engagement7d?.averageSessionDuration ?? 0}</strong></li>
                          <li>Bounce Rate: <strong>{analytics.engagement7d?.bounceRate ?? 0}%</strong></li>
                        </ul>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">Engagement Stats</h6>
                        <ul className="list-unstyled mb-0">
                          <li>Engaged Sessions: <strong>{analytics.engagement7d?.engagedSessions ?? 0}</strong></li>
                          <li>Engagement Rate: <strong>{analytics.engagement7d?.engagementRate ?? 0}%</strong></li>
                          <li>Page Views: <strong>{analytics.engagement7d?.screenPageViews ?? 0}</strong></li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-3">System Health</h5>
                  {!health ? (
                    <div>Loading system health...</div>
                  ) : (
                    <div className="row">
                      <div className="col-md-3">
                        <h6 className="text-muted">Uptime</h6>
                        <div><strong>{Math.floor((health.uptimeSeconds || 0) / 60)} min</strong></div>
                        <div className={health.database?.connected ? 'text-success' : 'text-danger'}>
                          DB: <strong>{health.database?.connected ? 'Connected' : 'Disconnected'}</strong>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">Memory</h6>
                        <ul className="list-unstyled mb-0">
                          <li>Heap Used: <strong>{Math.round((health.memory?.heapUsed || 0) / (1024 * 1024))} MB</strong></li>
                          <li>Heap Total: <strong>{Math.round((health.memory?.heapTotal || 0) / (1024 * 1024))} MB</strong></li>
                        </ul>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">CPU</h6>
                        <ul className="list-unstyled mb-0">
                          <li>User: <strong>{Math.round((health.cpu?.user || 0) / 1000)} ms</strong></li>
                          <li>System: <strong>{Math.round((health.cpu?.system || 0) / 1000)} ms</strong></li>
                        </ul>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">Runtime</h6>
                        <ul className="list-unstyled mb-0">
                          <li>Node: <strong>{health.nodeVersion}</strong></li>
                          <li>Updated: <strong>{new Date(health.timestamp).toLocaleTimeString()}</strong></li>
                        </ul>
                      </div>
                    </div>
                  )}
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