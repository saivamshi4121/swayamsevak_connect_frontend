import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const initialForm = {
  title: '',
  type: '',
  fileUrl: '',
  uploadedBy: '',
  category: '',
  tags: '',
  publishDate: '',
};

const ResourceManager = () => {
  const [resources, setResources] = useState([]);
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
      const [resRes, uRes] = await Promise.all([
        api.get('/resources'),
        api.get('/users'),
      ]);
      setResources(resRes.data);
      setUsers(uRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load resources or users');
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (resource = null) => {
    if (resource) {
      setForm({
        ...resource,
        uploadedBy: resource.uploadedBy?._id || '',
        tags: resource.tags?.join(', ') || '',
        publishDate: resource.publishDate ? resource.publishDate.slice(0, 10) : '',
      });
      setEditingId(resource._id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setModalError('');
    setShowModal(true);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setActionLoading(true);
    setModalError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await api.put(`/resources/${editingId}`, payload);
      } else {
        await api.post('/resources', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Failed to save resource');
    }
    setActionLoading(false);
  };

  const handleDelete = async id => {
    setActionLoading(true);
    try {
      await api.delete(`/resources/${id}`);
      setShowDeleteId(null);
      fetchData();
    } catch (err) {
      alert('Failed to delete resource');
    }
    setActionLoading(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Resource Library</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>Upload Resource</button>
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
              <th>Type</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Uploaded By</th>
              <th>Publish Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <tr key={resource._id}>
                <td>{resource.title}</td>
                <td>{resource.type}</td>
                <td>{resource.category}</td>
                <td>{resource.tags?.join(', ')}</td>
                <td>{resource.uploadedBy?.name || '-'}</td>
                <td>{resource.publishDate ? new Date(resource.publishDate).toLocaleDateString() : ''}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => openModal(resource)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => setShowDeleteId(resource._id)}>Delete</button>
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
                  <h5 className="modal-title">{editingId ? 'Edit Resource' : 'Upload Resource'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger">{modalError}</div>}
                  <div className="mb-2">
                    <label>Title</label>
                    <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Type</label>
                    <input className="form-control" name="type" value={form.type} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>File URL</label>
                    <input className="form-control" name="fileUrl" value={form.fileUrl} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label>Category</label>
                    <input className="form-control" name="category" value={form.category} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label>Tags (comma separated)</label>
                    <input className="form-control" name="tags" value={form.tags} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label>Uploaded By</label>
                    <select className="form-select" name="uploadedBy" value={form.uploadedBy} onChange={handleChange} required>
                      <option value="">Select Uploader</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label>Publish Date</label>
                    <input className="form-control" name="publishDate" type="date" value={form.publishDate} onChange={handleChange} />
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
                <h5 className="modal-title">Delete Resource</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this resource?
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

export default ResourceManager; 