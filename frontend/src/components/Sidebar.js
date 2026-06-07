import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard,
  MdStore,
  MdPeople,
  MdPersonAdd,
  MdAddBusiness,
  MdLock,
  MdLogout,
} from 'react-icons/md';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
  { to: '/admin/stores', label: 'Stores', icon: <MdStore /> },
  { to: '/admin/users', label: 'Users', icon: <MdPeople /> },
  { to: '/admin/add-user', label: 'Add User', icon: <MdPersonAdd /> },
  { to: '/admin/add-store', label: 'Add Store', icon: <MdAddBusiness /> },
  { to: '/update-password', label: 'Change Password', icon: <MdLock /> },
];

const userLinks = [
  { to: '/stores', label: 'All Stores', icon: <MdStore /> },
  { to: '/update-password', label: 'Change Password', icon: <MdLock /> },
];

const ownerLinks = [
  { to: '/owner/dashboard', label: 'My Dashboard', icon: <MdDashboard /> },
  { to: '/update-password', label: 'Change Password', icon: <MdLock /> },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'store_owner'
      ? ownerLinks
      : userLinks;

  const initials = user?.name
    ? user.name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrator'
      : user?.role === 'store_owner'
      ? 'Store Owner'
      : 'User';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>RateStore</h1>
        <span>Platform</span>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name?.split(' ')[0] || 'User'}</div>
            <div className="user-role">{roleLabel}</div>
          </div>
        </div>
        <button className="nav-link btn-secondary btn btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
          <MdLogout />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
