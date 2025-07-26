import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = {
  name: '',
  email: '',
  role: 'user',
  active: true,
};

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (user = null) => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active !== false,
      });
      setEditingId(user._id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setModalError('');
    setShowModal(true);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setActionLoading(true);
    setModalError('');
    try {
      const payload = { ...form };
      if (editingId) {
        await api.put(`/users/${editingId}`, payload);
      } else {
        // For new user, you may want to set a default password or send invite
        await api.post('/users', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Failed to save user');
    }
    setActionLoading(false);
  };

  const handleDelete = async id => {
    setActionLoading(true);
    try {
      await api.delete(`/users/${id}`);
      setShowDeleteId(null);
      fetchData();
    } catch (err) {
      alert('Failed to delete user');
    }
    setActionLoading(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>Add New User</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.active !== false ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openModal(user)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteId(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal for add/edit */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit User' : 'Add New User'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger">{modalError}</div>}
                  <div className="mb-2">
                    <label>Name</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Email</label>
                    <input className="form-control" name="email" value={form.email} onChange={handleChange} required type="email" />
                  </div>
                  <div className="mb-2">
                    <label>Role</label>
                    <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" name="active" checked={form.active} onChange={handleChange} id="activeCheck" />
                    <label className="form-check-label" htmlFor="activeCheck">Active</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Delete confirmation */}
      {showDeleteId && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete User</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this user?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(showDeleteId)} disabled={actionLoading}>{actionLoading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager; 