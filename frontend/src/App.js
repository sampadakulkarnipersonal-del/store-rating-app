import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import UpdatePassword from './pages/auth/UpdatePassword';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminStores from './pages/admin/AdminStores';
import AddUser from './pages/admin/AddUser';
import AddStore from './pages/admin/AddStore';

// User pages
import UserStores from './pages/user/UserStores';

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RootRedirect />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>}
          />
          <Route
            path="/admin/users/:id"
            element={<ProtectedRoute roles={['admin']}><AdminUserDetail /></ProtectedRoute>}
          />
          <Route
            path="/admin/stores"
            element={<ProtectedRoute roles={['admin']}><AdminStores /></ProtectedRoute>}
          />
          <Route
            path="/admin/add-user"
            element={<ProtectedRoute roles={['admin']}><AddUser /></ProtectedRoute>}
          />
          <Route
            path="/admin/add-store"
            element={<ProtectedRoute roles={['admin']}><AddStore /></ProtectedRoute>}
          />

          {/* Normal User */}
          <Route
            path="/stores"
            element={<ProtectedRoute roles={['user']}><UserStores /></ProtectedRoute>}
          />

          {/* Change Password — accessible by ALL logged-in roles */}
          <Route
            path="/update-password"
            element={<ProtectedRoute roles={['user', 'store_owner', 'admin']}><UpdatePassword /></ProtectedRoute>}
          />

          {/* Store Owner */}
          <Route
            path="/owner/dashboard"
            element={<ProtectedRoute roles={['store_owner']}><OwnerDashboard /></ProtectedRoute>}
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
