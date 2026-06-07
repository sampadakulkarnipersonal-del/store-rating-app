import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Store name is required.';
  else if (form.name.trim().length < 20 || form.name.trim().length > 60)
    errors.name = 'Store name must be 20-60 characters.';
  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email.';
  if (form.address && form.address.length > 400) errors.address = 'Max 400 characters.';
  return errors;
};

const AddStore = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      const payload = { ...form };
      if (!payload.ownerId) delete payload.ownerId;
      await api.post('/admin/stores', payload);
      setSuccess('Store created successfully.');
      setForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs && errs.length > 0) setServerError(errs[0].msg);
      else setServerError(err.response?.data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Add Store</h2>
        <p>Register a new store on the platform</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Store Name <span style={{ color: 'var(--text-dim)' }}>(20–60 chars)</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Green Valley Organic Grocery Store"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Store Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="store@example.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Address <span style={{ color: 'var(--text-dim)' }}>(optional)</span></label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-input"
              rows={2}
              placeholder="Store location..."
            />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Owner ID <span style={{ color: 'var(--text-dim)' }}>(optional — store owner's user ID)</span></label>
            <input
              type="number"
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. 5"
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Creating...' : 'Create Store'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/stores')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
