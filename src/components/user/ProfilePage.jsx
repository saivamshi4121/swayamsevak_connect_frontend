import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', number: '', age: '', designation: '', shakha: '' });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  // Password change state
  const [pw, setPw] = useState({ old: '', new1: '', new2: '' });
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/me');
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          number: res.data.number || '',
          age: res.data.age || '',
          designation: res.data.designation || '',
          shakha: res.data.shakha || '',
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePwChange = e => setPw(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(''); setError('');
    try {
      const res = await api.put(`/users/${user.id}`, form);
      setSuccess('Profile updated!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Update failed');
    }
  };

  const handlePassword = e => {
    e.preventDefault();
    setPwMsg('');
    if (!pw.old || !pw.new1 || !pw.new2) return setPwMsg('All fields required');
    if (pw.new1 !== pw.new2) return setPwMsg('New passwords do not match');
    // No backend endpoint for password change in current codebase
    setPwMsg('Password change not implemented.');
  };

  return (
    <div className="container py-4" style={{maxWidth: 600}}>
      <h2 className="fw-bold mb-3">Profile & Settings</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input className="form-control" name="email" value={form.email} onChange={handleChange} required type="email" />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Number</label>
              <input className="form-control" name="number" value={form.number} onChange={handleChange} required type="tel" />
            </div>
            <div className="mb-3">
              <label className="form-label">Age</label>
              <input className="form-control" name="age" value={form.age} onChange={handleChange} required type="number" min={10} max={100} />
            </div>
            <div className="mb-3">
              <label className="form-label">Designation</label>
              <input className="form-control" name="designation" value={form.designation} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Shakha</label>
              <input className="form-control" name="shakha" value={form.shakha} onChange={handleChange} required />
            </div>
            {success && <div className="alert alert-success py-1 mb-2">{success}</div>}
            {error && <div className="alert alert-danger py-1 mb-2">{error}</div>}
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Change Password</h5>
          <form onSubmit={handlePassword}>
            <div className="mb-2">
              <label className="form-label">Current Password</label>
              <input className="form-control" name="old" value={pw.old} onChange={handlePwChange} type="password" autoComplete="current-password" />
            </div>
            <div className="mb-2">
              <label className="form-label">New Password</label>
              <input className="form-control" name="new1" value={pw.new1} onChange={handlePwChange} type="password" autoComplete="new-password" />
            </div>
            <div className="mb-2">
              <label className="form-label">Confirm New Password</label>
              <input className="form-control" name="new2" value={pw.new2} onChange={handlePwChange} type="password" autoComplete="new-password" />
            </div>
            {pwMsg && <div className="alert alert-info py-1 mb-2">{pwMsg}</div>}
            <button type="submit" className="btn btn-secondary">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 