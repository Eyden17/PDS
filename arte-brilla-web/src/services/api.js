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

export async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(buildUrl(path), {
    ...options,
    headers
  });

  if (res.status === 401) {
    localStorage.removeItem('ab_session');
    window.location.href = '/login';
    return;
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(body?.error || body?.message || 'Error en API');
    error.code = body?.code;
    error.details = body?.details;
    throw error;
  }

  return body;
}
