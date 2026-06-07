import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  else if (form.name.trim().length < 20) errors.name = 'Name must be at least 20 characters.';
  else if (form.name.trim().length > 60) errors.name = 'Name cannot exceed 60 characters.';

  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address.';

  if (form.address && form.address.length > 400) errors.address = 'Address cannot exceed 400 characters.';

  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8 || form.password.length > 16)
    errors.password = 'Password must be 8-16 characters.';
  else if (!/[A-Z]/.test(form.password))
    errors.password = 'Password needs at least one uppercase letter.';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password))
    errors.password = 'Password needs at least one special character.';

  return errors;
};

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await signup(form);
    if (result.success) {
      navigate('/stores');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <h1>RateStore</h1>
          <p>Create your account</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="you@example.com"
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
              placeholder="Your street address..."
              rows={2}
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
