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

  requestPasswordResetOtp: (email) =>
    apiFetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }),

  verifyPasswordResetOtp: (email, code) =>
    apiFetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    }),

  resetPasswordWithOtp: (email, code, newPassword) =>
    apiFetch("/api/auth/otp/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, new_password: newPassword }),
    }),

  logout: () => {
    localStorage.removeItem('ab_session');
    window.location.href = '/login';
  }
};
