import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const HelpRequestsManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [response, setResponse] = useState({});
  const [saving, setSaving] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await api.get('/help');
        setRequests(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load help requests');
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleResponseChange = (id, value) => setResponse(r => ({ ...r, [id]: value }));

  const handleRespond = async (id, status) => {
    setSaving(id);
    try {
      await api.patch(`/help/${id}`, { response: response[id], status });
      setRequests(reqs => reqs.map(r => r._id === id ? { ...r, response: response[id], status } : r));
      setSaving('');
    } catch (err) {
      setError('Failed to respond');
      setSaving('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this help request?')) return;
    setSaving(id);
    try {
      await api.delete(`/help/${id}`);
      setRequests(reqs => reqs.filter(r => r._id !== id));
      setSaving('');
    } catch (err) {
      setError('Failed to delete');
      setSaving('');
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">User Help Requests</h2>
      {loading ? <div>Loading...</div> : error ? <div className="alert alert-danger">{error}</div> : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Message</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Response</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={6} className="text-center">No help requests found.</td></tr>
              ) : requests.map(req => (
                <tr key={req._id}>
                  <td>{req.user?.name}<br /><span className="text-muted small">{req.user?.email}</span></td>
                  <td>{req.message}</td>
                  <td>{req.status}</td>
                  <td>{new Date(req.createdAt).toLocaleString()}</td>
                  <td>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={response[req._id] !== undefined ? response[req._id] : (req.response || '')}
                      onChange={e => handleResponseChange(req._id, e.target.value)}
                      disabled={req.status === 'closed'}
                    />
                  </td>
                  <td>
                    {req.status === 'open' ? (
                      <button
                        className="btn btn-success btn-sm"
                        disabled={saving === req._id}
                        onClick={() => handleRespond(req._id, 'closed')}
                      >{saving === req._id ? 'Saving...' : 'Respond & Close'}</button>
                    ) : (
                      <span className="text-muted">Closed</span>
                    )}
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      disabled={saving === req._id}
                      onClick={() => handleDelete(req._id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HelpRequestsManager; 