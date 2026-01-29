import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextProvider';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // { role, email, id }
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

  useEffect(() => {
    // Always clear session on page access
    localStorage.removeItem('ab_session');
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, message: body.error || 'Login failed' };
    }

    const session = {
      accessToken: body.accessToken,
      user: { id: body.user.id, email: body.user.email, role: body.role }
    };

    localStorage.setItem('ab_session', JSON.stringify(session));
    setIsAuthenticated(true);
    setUser(session.user);

    return { success: true, role: body.role };
  };

  const logout = () => {
    localStorage.removeItem('ab_session');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
