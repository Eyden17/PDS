// src/services/reportService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAccessToken() {
  const raw = localStorage.getItem('ab_session');
  const session = raw ? JSON.parse(raw) : null;
  return session?.accessToken || null;
}

function buildUrl(path) {
  const base = API_BASE.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(buildUrl(path), { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('ab_session');
    window.location.href = '/login';
    return;
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.error || body?.message || 'Error en API';
    throw new Error(msg);
  }

  return body; // backend devuelve array directo
}

export const reportService = {
  // GET /api/reports/cobranza?year=YYYY&month=MM&group=Babies&only_debtors=false
  getCobranza: async ({ year, month, group = null, onlyDebtors = false, limit = 500, offset = 0 }) => {
    const params = new URLSearchParams();
    params.set('year', String(year));
    params.set('month', String(month));
    if (group) params.set('group', group);
    params.set('only_debtors', String(onlyDebtors));
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    return apiFetch(`/api/reports/cobranza?${params.toString()}`);
  },
};
