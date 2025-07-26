import React, { useState } from 'react';
import api from '../../services/api';

const HelpPage = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(''); setError('');
    if (!message.trim()) return setError('Please enter your help request.');
    setLoading(true);
    try {
      await api.post('/help', { message });
      setSuccess('Your help request has been sent to the admin.');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send help request.');
    }
    setLoading(false);
  };

  return (
    <div className="container py-4" style={{maxWidth: 600}}>
      <h2 className="fw-bold mb-3">Help & Support</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <label className="form-label">Describe your issue or question for the admin:</label>
            <textarea
              className="form-control mb-3"
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your help request here..."
              required
            />
            {success && <div className="alert alert-success py-1 mb-2">{success}</div>}
            {error && <div className="alert alert-danger py-1 mb-2">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send to Admin'}</button>
          </form>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <p className="mb-0 text-muted">Find FAQs, guides, and contact support for any help you need using the portal.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 