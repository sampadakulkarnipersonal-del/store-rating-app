import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import { MdSearch } from 'react-icons/md';
import StarRating from '../../components/StarRating';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy: sort.field, order: sort.order };
      const res = await api.get('/admin/stores', { params });
      setStores(res.data);
    } catch (err) {
      setError('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const toggleSort = (field) => {
    setSort(prev =>
      prev.field === field
        ? { field, order: prev.order === 'ASC' ? 'DESC' : 'ASC' }
        : { field, order: 'ASC' }
    );
  };

  const SortIcon = ({ field }) =>
    sort.field === field
      ? <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>
      : <span className="sort-icon">↕</span>;

  return (
    <div>
      <div className="page-header">
        <h2>Stores</h2>
        <p>All registered stores and their ratings</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="filter-bar">
          <div style={{ position: 'relative' }}>
            <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              name="name"
              value={filters.name}
              onChange={e => setFilters(p => ({ ...p, name: e.target.value }))}
              className="form-input"
              placeholder="Search by name..."
              style={{ paddingLeft: 32 }}
            />
          </div>
          <input
            name="email"
            value={filters.email}
            onChange={e => setFilters(p => ({ ...p, email: e.target.value }))}
            className="form-input"
            placeholder="Filter by email..."
          />
          <input
            name="address"
            value={filters.address}
            onChange={e => setFilters(p => ({ ...p, address: e.target.value }))}
            className="form-input"
            placeholder="Filter by address..."
          />
        </div>

        {loading ? (
          <div className="page-loading"><span className="spinner" /> Loading...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className={sort.field === 'name' ? 'sort-active' : ''} onClick={() => toggleSort('name')}>
                    Name <SortIcon field="name" />
                  </th>
                  <th className={sort.field === 'email' ? 'sort-active' : ''} onClick={() => toggleSort('email')}>
                    Email <SortIcon field="email" />
                  </th>
                  <th className={sort.field === 'address' ? 'sort-active' : ''} onClick={() => toggleSort('address')}>
                    Address <SortIcon field="address" />
                  </th>
                  <th className={sort.field === 'average_rating' ? 'sort-active' : ''} onClick={() => toggleSort('average_rating')}>
                    Rating <SortIcon field="average_rating" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  stores.map(store => (
                    <tr key={store.id}>
                      <td style={{ fontWeight: 500 }}>{store.name}</td>
                      <td className="td-muted">{store.email}</td>
                      <td className="td-muted">{store.address || '—'}</td>
                      <td>
                        <StarRating value={parseFloat(store.average_rating)} readOnly size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStores;
