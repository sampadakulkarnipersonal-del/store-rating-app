import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  else if (form.name.trim().length < 20 || form.name.trim().length > 60)
    errors.name = 'Name must be 20-60 characters.';
  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email.';
  if (form.address && form.address.length > 400) errors.address = 'Max 400 characters.';
  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8 || form.password.length > 16)
    errors.password = 'Must be 8-16 characters.';
  else if (!/[A-Z]/.test(form.password)) errors.password = 'Needs one uppercase letter.';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
    errors.password = 'Needs one special character.';
  return errors;
};

const AddUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
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
      await api.post('/admin/users', form);
      setSuccess(`User "${form.name.split(' ')[0]}" created successfully.`);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (errs && errs.length > 0) setServerError(errs[0].msg);
      else setServerError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Add User</h2>
        <p>Create a new user account</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: 'var(--text-dim)' }}>(20–60 chars)</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. John Alexander Williams"
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="form-input">
                <option value="user">Normal User</option>
                <option value="admin">Administrator</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="user@example.com"
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
              placeholder="Street address..."
            />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              placeholder="8-16 chars, 1 uppercase, 1 special"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
