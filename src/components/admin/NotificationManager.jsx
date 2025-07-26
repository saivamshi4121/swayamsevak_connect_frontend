import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = {
  title: '',
  message: '',
  recipients: ['all'],
};

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [nRes, uRes] = await Promise.all([
        api.get('/notifications'),
        api.get('/users'),
      ]);
      setNotifications(nRes.data);
      setUsers(uRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load notifications or users');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === 'recipients') {
      setForm(f => ({ ...f, recipients: Array.from(selectedOptions, o => o.value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    setFormError('');
    try {
      if (!form.title || !form.message || !form.recipients.length) {
        setFormError('All fields are required');
        setSending(false);
        return;
      }
      await api.post('/notifications', form);
      setForm(initialForm);
      fetchData();
    } catch (err) {
      setFormError(err.response?.data?.msg || 'Failed to send notification');
    }
    setSending(false);
  };

  const handleDelete = async id => {
    setDeletingId(id);
    try {
      await api.delete(`/notifications/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete notification');
    }
    setDeletingId(null);
  };

  return (
    <div>
      <h2>Notifications</h2>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Send Notification</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Title</label>
              <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label>Message</label>
              <textarea className="form-control" name="message" value={form.message} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label>Recipients</label>
              <select className="form-select" name="recipients" value={form.recipients} onChange={handleChange} multiple>
                <option value="all">All Users</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <small className="text-muted">Hold Ctrl/Cmd to select multiple users. "All Users" overrides other selections.</small>
            </div>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'Sending...' : 'Send'}</button>
          </form>
        </div>
      </div>
      <h5>Sent Notifications</h5>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Recipients</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n._id}>
                <td>{n.title}</td>
                <td>{n.message}</td>
                <td>
                  {n.recipients.includes('all') ? 'All Users' : n.recipients.length + ' user(s)'}
                </td>
                <td>{new Date(n.createdAt).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(n._id)} disabled={deletingId === n._id}>
                    {deletingId === n._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NotificationManager; 