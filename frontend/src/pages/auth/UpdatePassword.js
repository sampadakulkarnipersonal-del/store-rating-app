import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MdLock } from 'react-icons/md';

const validatePassword = (pw) => {
  if (!pw) return 'Password is required.';
  if (pw.length < 8 || pw.length > 16) return 'Password must be 8-16 characters.';
  if (!/[A-Z]/.test(pw)) return 'Must contain at least one uppercase letter.';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw)) return 'Must contain at least one special character.';
  return '';
};

const UpdatePassword = () => {
  const { updatePassword } = useAuth();

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!form.currentPassword) newErrors.currentPassword = 'Current password is required.';

    const newPwError = validatePassword(form.newPassword);
    if (newPwError) newErrors.newPassword = newPwError;

    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await updatePassword(form.currentPassword, form.newPassword);
    setLoading(false);

    if (result.success) {
      setSuccess('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setErrors({ server: result.message });
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Change Password</h2>
        <p>Update your account password</p>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="card-header">
          <span className="card-title flex items-center gap-2">
            <MdLock />
            Security Settings
          </span>
        </div>

        {errors.server && <div className="alert alert-error">{errors.server}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Your current password"
            />
            {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="8-16 chars, 1 uppercase, 1 special"
            />
            {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Repeat new password"
            />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
