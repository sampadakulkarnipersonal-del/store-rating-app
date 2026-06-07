import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: userData.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', formData);
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        return { success: false, message: errors[0].msg };
      }
      return { success: false, message: err.response?.data?.message || 'Signup failed.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/update-password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        return { success: false, message: errors[0].msg };
      }
      return { success: false, message: err.response?.data?.message || 'Password update failed.' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
