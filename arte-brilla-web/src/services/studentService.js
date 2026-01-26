
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
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(buildUrl(path), { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('ab_session');
    window.location.href = '/login';
    return;
  }

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const apiError = new Error(body?.error || body?.message || 'Error en API');
    apiError.code = body?.code;
    apiError.details = body?.details;
    throw apiError;
  }

  return body;
}

export const studentService = {
  // GET /api/students?...
  getAllStudents: async ({ q = '', active = null, limit = 100, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (active !== null) params.set('active', String(active));
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    return apiFetch(`/api/students?${params.toString()}`);
  },

  createStudent: async (studentData) => {
    return apiFetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
  },

  updateStudent: async (id, studentData) => {
    return apiFetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
  },

  deleteStudent: async (id) => {
    return apiFetch(`/api/students/${id}`, { method: 'DELETE' });
  }
};
