import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = {
  eventName: '',
  description: '',
  date: '',
  type: '',
  region: '',
  isOpenToAll: true,
  participants: [],
  createdBy: '',
};

const EventManager = () => {
  const [events, setEvents] = useState([]);
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
      const [evRes, uRes] = await Promise.all([
        api.get('/events'),
        api.get('/users'),
      ]);
      setEvents(evRes.data);
      setUsers(uRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events or users');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (event = null) => {
    if (event) {
      setForm({
        ...event,
        participants: event.participants?.map(p => p._id) || [],
        createdBy: event.createdBy?._id || '',
        date: event.date ? event.date.slice(0, 16) : '',
        isOpenToAll: event.isOpenToAll !== undefined ? event.isOpenToAll : true,
      });
      setEditingId(event._id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setModalError('');
    setShowModal(true);
  };

  const handleChange = e => {
    const { name, value, type, checked, selectedOptions } = e.target;
    if (name === 'participants') {
      setForm(f => ({ ...f, participants: Array.from(selectedOptions, o => o.value) }));
    } else if (type === 'checkbox') {
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
        await api.put(`/events/${editingId}`, payload);
      } else {
        await api.post('/events', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Failed to save event');
    }
    setActionLoading(false);
  };

  const handleDelete = async id => {
    setActionLoading(true);
    try {
      await api.delete(`/events/${id}`);
      setShowDeleteId(null);
      fetchData();
    } catch (err) {
      alert('Failed to delete event');
    }
    setActionLoading(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Event Management</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>Add New Event</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Type</th>
              <th>Region</th>
              <th>Participants</th>
              <th>Registration</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td>{event.eventName}</td>
                <td>{event.date ? new Date(event.date).toLocaleString() : ''}</td>
                <td>{event.type}</td>
                <td>{event.region}</td>
                <td>{event.participants?.length || 0} registered</td>
                <td>
                  <span className={`badge ${event.isOpenToAll ? 'bg-success' : 'bg-warning'}`}>
                    {event.isOpenToAll ? 'Open to All' : 'Invite Only'}
                  </span>
                </td>
                <td>{event.createdBy?.name || '-'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openModal(event)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteId(event._id)}>Delete</button>
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
                  <h5 className="modal-title">{editingId ? 'Edit Event' : 'Add New Event'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger">{modalError}</div>}
                  <div className="mb-2">
                    <label>Title</label>
                    <input className="form-control" name="eventName" value={form.eventName} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Description</label>
                    <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label>Date & Time</label>
                    <input className="form-control" name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Type</label>
                    <input className="form-control" name="type" value={form.type} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label>Region</label>
                    <input className="form-control" name="region" value={form.region} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        name="isOpenToAll" 
                        checked={form.isOpenToAll} 
                        onChange={handleChange} 
                        id="openToAll" 
                      />
                      <label className="form-check-label" htmlFor="openToAll">
                        Open for everyone to join
                      </label>
                    </div>
                    <small className="text-muted">When checked, users can join this event themselves. When unchecked, you can manually select participants.</small>
                  </div>
                  {!form.isOpenToAll && (
                    <div className="mb-2">
                      <label>Participants (Manual Selection)</label>
                      <select className="form-select" name="participants" value={form.participants} onChange={handleChange} multiple>
                        {users.map(u => (
                          <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                      <small className="text-muted">Hold Ctrl/Cmd to select multiple participants</small>
                    </div>
                  )}
                  <div className="mb-2">
                    <label>Created By</label>
                    <select className="form-select" name="createdBy" value={form.createdBy} onChange={handleChange} required>
                      <option value="">Select Creator</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
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
                <h5 className="modal-title">Delete Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this event?
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

export default EventManager; 