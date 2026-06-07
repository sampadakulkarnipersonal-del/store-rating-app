import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { MdPeople, MdStore, MdStar } from 'react-icons/md';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <span className="spinner" /> Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>Platform-wide overview</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <MdPeople className="stat-icon" />
          </div>
          <div className="stat-card green">
            <div className="stat-label">Registered Stores</div>
            <div className="stat-value">{stats.totalStores}</div>
            <MdStore className="stat-icon" />
          </div>
          <div className="stat-card orange">
            <div className="stat-label">Total Ratings</div>
            <div className="stat-value">{stats.totalRatings}</div>
            <MdStar className="stat-icon" />
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">Quick Actions</span>
        </div>
        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: 16 }}>
          Use the sidebar to manage users, stores, and view reports.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/admin/users" className="btn btn-secondary">
            <MdPeople /> View All Users
          </a>
          <a href="/admin/stores" className="btn btn-secondary">
            <MdStore /> View All Stores
          </a>
          <a href="/admin/add-user" className="btn btn-primary">
            + Add User
          </a>
          <a href="/admin/add-store" className="btn btn-primary">
            + Add Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
