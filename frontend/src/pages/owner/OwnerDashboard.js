import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import StarRating from '../../components/StarRating';
import { MdStar, MdPeople } from 'react-icons/md';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState({ field: 'updated_at', order: 'DESC' });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/owner/dashboard');
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="page-loading"><span className="spinner" /> Loading dashboard...</div>;

  const toggleSort = (field) => {
    setSort(prev =>
      prev.field === field
        ? { field, order: prev.order === 'ASC' ? 'DESC' : 'ASC' }
        : { field, order: 'ASC' }
    );
  };

  const sortedRaters = data?.raters ? [...data.raters].sort((a, b) => {
    const { field, order } = sort;
    const valA = a[field] ?? '';
    const valB = b[field] ?? '';
    const cmp = typeof valA === 'string'
      ? valA.localeCompare(valB)
      : valA - valB;
    return order === 'ASC' ? cmp : -cmp;
  }) : [];

  const SortIcon = ({ field }) =>
    sort.field === field
      ? <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
      : <span className="sort-icon">↕</span>;

  return (
    <div>
      <div className="page-header">
        <h2>My Store Dashboard</h2>
        <p>Overview of your store's performance</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {data && (
        <>
          <div className="stats-grid">
            <div className="stat-card orange">
              <div className="stat-label">Average Rating</div>
              <div className="stat-value">{Number(data.store.averageRating).toFixed(2)}</div>
              <MdStar className="stat-icon" />
            </div>
            <div className="stat-card green">
              <div className="stat-label">Total Ratings</div>
              <div className="stat-value">{data.store.totalRatings}</div>
              <MdPeople className="stat-icon" />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <span className="card-title">Store Info</span>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <div className="form-label">Store Name</div>
                <div style={{ fontWeight: 600 }}>{data.store.name}</div>
              </div>
              <div>
                <div className="form-label">Email</div>
                <div className="text-muted">{data.store.email}</div>
              </div>
              <div>
                <div className="form-label">Address</div>
                <div className="text-muted">{data.store.address || 'Not provided'}</div>
              </div>
              <div>
                <div className="form-label">Overall Rating</div>
                <StarRating value={data.store.averageRating} readOnly size="lg" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Users Who Rated Your Store</span>
            </div>

            {sortedRaters.length === 0 ? (
              <div className="empty-state">
                <MdStar />
                <p>No ratings received yet.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th className={sort.field === 'user_name' ? 'sort-active' : ''} onClick={() => toggleSort('user_name')}>
                        User Name <SortIcon field="user_name" />
                      </th>
                      <th className={sort.field === 'user_email' ? 'sort-active' : ''} onClick={() => toggleSort('user_email')}>
                        Email <SortIcon field="user_email" />
                      </th>
                      <th className={sort.field === 'rating' ? 'sort-active' : ''} onClick={() => toggleSort('rating')}>
                        Rating <SortIcon field="rating" />
                      </th>
                      <th className={sort.field === 'updated_at' ? 'sort-active' : ''} onClick={() => toggleSort('updated_at')}>
                        Last Updated <SortIcon field="updated_at" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRaters.map(r => (
                      <tr key={r.user_id}>
                        <td style={{ fontWeight: 500 }}>{r.user_name}</td>
                        <td className="td-muted">{r.user_email}</td>
                        <td>
                          <StarRating value={r.rating} readOnly size="sm" />
                        </td>
                        <td className="td-muted">
                          {new Date(r.updated_at).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
