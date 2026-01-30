import React, { useState } from 'react';
import { AuthContext } from './AuthContextProvider';

export const AuthProvider = ({ children }) => {
  const [session] = useState(() => {
    const raw = localStorage.getItem("ab_session");
    return raw ? JSON.parse(raw) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!(session?.accessToken && session?.user));
  const [user, setUser] = useState(session?.user ?? null); // { role, email, id }
  const [loading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
      refreshToken: body.refreshToken,
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
