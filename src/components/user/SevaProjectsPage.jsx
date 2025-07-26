import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { io } from 'socket.io-client';

const SevaProjectsPage = () => {
  const [sevas, setSevas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSevas = async () => {
      setLoading(true);
      try {
        const res = await api.get('/seva');
        setSevas(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load seva projects');
        setLoading(false);
      }
    };
    fetchSevas();
  }, []);

  // Real-time updates with Socket.io
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('seva:created', seva => {
      setSevas(prev => [seva, ...prev]);
    });
    socket.on('seva:updated', updated => {
      setSevas(prev => prev.map(s => s._id === updated._id ? updated : s));
    });
    socket.on('seva:deleted', ({ _id }) => {
      setSevas(prev => prev.filter(s => s._id !== _id));
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">Seva Projects</h2>
      {loading ? (
        <div>Loading seva projects...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sevas.length === 0 ? (
        <div className="alert alert-info">No seva projects found.</div>
      ) : (
        <div className="row g-4">
          {sevas.map(seva => (
            <div className="col-md-6 col-lg-4" key={seva._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{seva.projectName}</h5>
                  <div className="mb-2 text-muted small">
                    {seva.region} | {seva.status} | {seva.donations} donations
                  </div>
                  <p className="card-text">{seva.description}</p>
                  <div className="small text-muted">Volunteers: {seva.volunteers?.length || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SevaProjectsPage; 