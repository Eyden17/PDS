import { apiFetch } from "./api";

export const authService = {
  // POST /api/auth/login
  login: async (email, password) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    // Guardamos la sesión completa (accessToken, user, role)
    if (data && data.accessToken) {
      localStorage.setItem('ab_session', JSON.stringify(data));
    }
    return data;
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (email) => {
    return apiFetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  },

  // POST /api/auth/verify-code
  verifyCode: async (email, code) => {
    return apiFetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
  },

  // POST /api/auth/reset-password
  resetPassword: async (email, code, newPassword) => {
    return apiFetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
  },

  logout: () => {
    localStorage.removeItem('ab_session');
    window.location.href = '/login';
  }
};
