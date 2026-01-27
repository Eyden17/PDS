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

  logout: () => {
    localStorage.removeItem('ab_session');
    window.location.href = '/login';
  }
};