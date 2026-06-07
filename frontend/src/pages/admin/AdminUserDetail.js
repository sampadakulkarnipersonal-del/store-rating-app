import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { MdArrowBack } from 'react-icons/md';
import StarRating from '../../components/StarRating';

const roleClass = { admin: 'badge-admin', user: 'badge-user', store_owner: 'badge-owner' };
const roleLabel = { admin: 'Administrator', user: 'Normal User', store_owner: 'Store Owner' };

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setUser(res.data);
      } catch (err) {
        setError('User not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="page-loading"><span className="spinner" /> Loading user...</div>;

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/users')} style={{ marginBottom: 12 }}>
          <MdArrowBack /> Back to Users
        </button>
        <h2>User Details</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {user && (
        <div className="card" style={{ maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}>
              {user.name?.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</div>
              <span className={`badge ${roleClass[user.role]}`}>{roleLabel[user.role]}</span>
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <div className="form-label">Email</div>
              <div>{user.email}</div>
            </div>
            <div>
              <div className="form-label">Address</div>
              <div>{user.address || <span className="text-muted">Not provided</span>}</div>
            </div>
            <div>
              <div className="form-label">Role</div>
              <div>{roleLabel[user.role]}</div>
            </div>
            {user.role === 'store_owner' && (
              <div>
                <div className="form-label">Store Average Rating</div>
                <StarRating value={user.averageRating} readOnly />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  {user.averageRating?.toFixed(2)} / 5.00
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetail;
