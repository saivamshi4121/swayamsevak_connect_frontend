import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = {
  name: '',
  lat: '',
  lng: '',
  region: '',
  category: '',
  schedule: '',
  visibility: true,
};

const ShakhaManager = () => {
  const [shakhas, setShakhas] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [modalError, setModalError] = useState('');
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch shakhas and users
  const fetchData = async () => {
    setLoading(true);
    try {
      const [shRes, uRes] = await Promise.all([
        api.get('/shakhas'),
        api.get('/users'),
      ]);
      setShakhas(shRes.data);
      setUsers(uRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load shakhas or users');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Open modal for add/edit
  const openModal = (shakha = null) => {
    if (shakha) {
      setForm({
        name: shakha.name || '',
        lat: shakha.location?.lat || '',
        lng: shakha.location?.lng || '',
        region: shakha.region || '',
        category: shakha.category || '',
        schedule: shakha.schedule || '',
        visibility: shakha.visibility !== undefined ? shakha.visibility : true,
      });
      setEditingId(shakha._id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setModalError('');
    setShowModal(true);
  };

  // Extract coordinates from Google Maps link
  const extractCoordinates = (url) => {
    const regex = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match = url.match(regex);
    if (match) {
      return { lat: match[1], lng: match[2] };
    }
    return null;
  };

  // Handle form change
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (name === 'mapsLink' && value) {
      // Extract coordinates from Google Maps link
      const coords = extractCoordinates(value);
      if (coords) {
        setForm(f => ({ ...f, lat: coords.lat, lng: coords.lng, [name]: value }));
      } else {
        setForm(f => ({ ...f, [name]: value }));
      }
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Submit add/edit
  const handleSubmit = async e => {
    e.preventDefault();
    setActionLoading(true);
    setModalError('');
    try {
      const payload = {
        name: form.name,
        location: {
          lat: parseFloat(form.lat) || 0,
          lng: parseFloat(form.lng) || 0
        },
        region: form.region,
        category: form.category,
        schedule: form.schedule,
        visibility: form.visibility
      };
      if (editingId) {
        await api.put(`/shakhas/${editingId}`, payload);
      } else {
        await api.post('/shakhas', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Failed to save shakha');
    }
    setActionLoading(false);
  };

  // Delete shakha
  const handleDelete = async id => {
    setActionLoading(true);
    try {
      await api.delete(`/shakhas/${id}`);
      setShowDeleteId(null);
      fetchData();
    } catch (err) {
      alert('Failed to delete shakha');
    }
    setActionLoading(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Shakha Management</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>Add New Shakha</button>
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
              <th>Region</th>
              <th>Category</th>
              <th>Schedule</th>
              <th>Organizer</th>
              <th>Visibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shakhas.map(shakha => (
              <tr key={shakha._id}>
                <td>{shakha.name}</td>
                <td>{shakha.region}</td>
                <td>{shakha.category}</td>
                <td>{shakha.schedule}</td>
                <td>{shakha.organizer?.name || '-'}</td>
                <td>{shakha.visibility ? 'Visible' : 'Hidden'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openModal(shakha)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteId(shakha._id)}>Delete</button>
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
                  <h5 className="modal-title">{editingId ? 'Edit Shakha' : 'Add New Shakha'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger">{modalError}</div>}
                  <div className="mb-2">
                    <label>Name</label>
                    <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Google Maps Link (Optional)</label>
                    <input className="form-control" name="mapsLink" onChange={handleChange} type="url" placeholder="Paste Google Maps link here - coordinates will be extracted automatically" />
                    <small className="text-muted">Or enter coordinates manually below</small>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label>Latitude</label>
                      <input className="form-control" name="lat" value={form.lat} onChange={handleChange} required type="number" step="any" placeholder="17.3850" />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label>Longitude</label>
                      <input className="form-control" name="lng" value={form.lng} onChange={handleChange} required type="number" step="any" placeholder="78.4867" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label>Region</label>
                    <input className="form-control" name="region" value={form.region} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Category</label>
                    <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
                      <option value="">Select Category</option>
                      <option value="Urban">Urban</option>
                      <option value="Rural">Rural</option>
                      <option value="Suburban">Suburban</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Schedule</label>
                    <input className="form-control" name="schedule" value={form.schedule} onChange={handleChange} placeholder="Daily 6:00 AM - 7:00 AM" />
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" name="visibility" checked={form.visibility} onChange={handleChange} id="shakhaVisible" />
                    <label className="form-check-label" htmlFor="shakhaVisible">Visible</label>
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
                <h5 className="modal-title">Delete Shakha</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this shakha?
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

export default ShakhaManager; 