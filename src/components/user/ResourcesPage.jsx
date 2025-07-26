import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { io } from 'socket.io-client';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const res = await api.get('/resources');
        setResources(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load resources');
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Real-time updates with Socket.io
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socket.on('resource:created', resource => {
      setResources(prev => [resource, ...prev]);
    });
    socket.on('resource:updated', updated => {
      setResources(prev => prev.map(r => r._id === updated._id ? updated : r));
    });
    socket.on('resource:deleted', ({ _id }) => {
      setResources(prev => prev.filter(r => r._id !== _id));
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3">Resource Center</h2>
      {loading ? (
        <div>Loading resources...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : resources.length === 0 ? (
        <div className="alert alert-info">No resources found.</div>
      ) : (
        <div className="row g-4">
          {resources.map(resource => (
            <div className="col-md-6 col-lg-4" key={resource._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{resource.title}</h5>
                  <div className="mb-2 text-muted small">
                    {resource.type} | {resource.category} | {resource.publishDate ? new Date(resource.publishDate).toLocaleDateString() : ''}
                  </div>
                  <p className="card-text">{resource.tags?.join(', ')}</p>
                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm mt-2">View/Download</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage; 