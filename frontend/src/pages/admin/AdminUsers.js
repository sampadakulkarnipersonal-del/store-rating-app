import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { MdSearch } from 'react-icons/md';

const roleClass = { admin: 'badge-admin', user: 'badge-user', store_owner: 'badge-owner' };
const roleLabel = { admin: 'Admin', user: 'User', store_owner: 'Store Owner' };

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sort, setSort] = useState({ field: 'name', order: 'ASC' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        sortBy: sort.field,
        order: sort.order,
      };
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleSort = (field) => {
    setSort(prev =>
      prev.field === field
        ? { field, order: prev.order === 'ASC' ? 'DESC' : 'ASC' }
        : { field, order: 'ASC' }
    );
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const SortIcon = ({ field }) => {
    if (sort.field !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon">{sort.order === 'ASC' ? '↑' : '↓'}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h2>Users</h2>
        <p>All registered users on the platform</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="filter-bar">
          <div style={{ position: 'relative' }}>
            <MdSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="form-input"
              placeholder="Search by name..."
              style={{ paddingLeft: 32 }}
            />
          </div>
          <input
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            className="form-input"
            placeholder="Filter by email..."
          />
          <input
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
            className="form-input"
            placeholder="Filter by address..."
          />
          <select name="role" value={filters.role} onChange={handleFilterChange} className="form-input">
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        {loading ? (
          <div className="page-loading"><span className="spinner" /> Loading...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th className={sort.field === 'name' ? 'sort-active' : ''} onClick={() => toggleSort('name')}>
                    Name <SortIcon field="name" />
                  </th>
                  <th className={sort.field === 'email' ? 'sort-active' : ''} onClick={() => toggleSort('email')}>
                    Email <SortIcon field="email" />
                  </th>
                  <th className={sort.field === 'address' ? 'sort-active' : ''} onClick={() => toggleSort('address')}>
                    Address <SortIcon field="address" />
                  </th>
                  <th className={sort.field === 'role' ? 'sort-active' : ''} onClick={() => toggleSort('role')}>
                    Role <SortIcon field="role" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id}>
                      <td className="td-muted" style={{ fontWeight: 600, color: 'var(--primary)' }}>#{u.id}</td>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td className="td-muted">{u.email}</td>
                      <td className="td-muted">{u.address || '—'}</td>
                      <td>
                        <span className={`badge ${roleClass[u.role]}`}>{roleLabel[u.role]}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                        >
                          View
                        </button>
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

export default AdminUsers;
