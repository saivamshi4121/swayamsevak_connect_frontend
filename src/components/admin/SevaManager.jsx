import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = {
  projectName: '',
  region: '',
  description: '',
  goals: '',
  metrics: '',
  volunteers: [],
  donations: '',
  status: 'Active',
};

const SevaManager = () => {
  const [sevas, setSevas] = useState([]);
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
      const [svRes, uRes] = await Promise.all([
        api.get('/seva'),
        api.get('/users'),
      ]);
      setSevas(svRes.data);
      setUsers(uRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load seva projects or users');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (seva = null) => {
    if (seva) {
      setForm({
        ...seva,
        volunteers: seva.volunteers?.map(v => v._id) || [],
        donations: seva.donations || '',
      });
      setEditingId(seva._id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setModalError('');
    setShowModal(true);
  };

  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === 'volunteers') {
      setForm(f => ({ ...f, volunteers: Array.from(selectedOptions, o => o.value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setActionLoading(true);
    setModalError('');
    try {
      const payload = { ...form, donations: parseFloat(form.donations) || 0 };
      if (editingId) {
        await api.put(`/seva/${editingId}`, payload);
      } else {
        await api.post('/seva', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Failed to save seva project');
    }
    setActionLoading(false);
  };

  const handleDelete = async id => {
    setActionLoading(true);
    try {
      await api.delete(`/seva/${id}`);
      setShowDeleteId(null);
      fetchData();
    } catch (err) {
      alert('Failed to delete seva project');
    }
    setActionLoading(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Seva Projects</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>Add Seva Project</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Project Name</th>
              <th>Region</th>
              <th>Status</th>
              <th>Volunteers</th>
              <th>Donations</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sevas.map(seva => (
              <tr key={seva._id}>
                <td>{seva.projectName}</td>
                <td>{seva.region}</td>
                <td>{seva.status}</td>
                <td>{seva.volunteers?.map(v => v.name).join(', ')}</td>
                <td>{seva.donations}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openModal(seva)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteId(seva._id)}>Delete</button>
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
                  <h5 className="modal-title">{editingId ? 'Edit Seva Project' : 'Add Seva Project'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger">{modalError}</div>}
                  <div className="mb-2">
                    <label>Project Name</label>
                    <input className="form-control" name="projectName" value={form.projectName} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Region</label>
                    <input className="form-control" name="region" value={form.region} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label>Status</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Volunteers</label>
                    <select className="form-select" name="volunteers" value={form.volunteers} onChange={handleChange} multiple>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Donations</label>
                    <input className="form-control" name="donations" value={form.donations} onChange={handleChange} type="number" min="0" />
                  </div>
                  <div className="mb-2">
                    <label>Description</label>
                    <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label>Goals</label>
                    <input className="form-control" name="goals" value={form.goals} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label>Metrics</label>
                    <input className="form-control" name="metrics" value={form.metrics} onChange={handleChange} />
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
                <h5 className="modal-title">Delete Seva Project</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this seva project?
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

export default SevaManager; 