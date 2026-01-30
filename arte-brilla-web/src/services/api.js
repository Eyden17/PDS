const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SESSION_KEY = "ab_session";

function getAccessToken() {
  const raw = localStorage.getItem(SESSION_KEY);
  const session = raw ? JSON.parse(raw) : null;
  return session?.accessToken || null;
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function buildUrl(path) {
  const base = API_BASE.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

async function refreshAccessToken() {
  const session = getSession();
  if (!session?.refreshToken) return false;

  const res = await fetch(buildUrl("/api/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });

  if (!res.ok) return false;

  const body = await res.json().catch(() => ({}));
  if (!body?.accessToken) return false;

  const nextSession = {
    ...session,
    accessToken: body.accessToken,
    refreshToken: body.refreshToken || session.refreshToken,
    user: body.user || session.user,
  };

  setSession(nextSession);
  return true;
}

export async function apiFetch(path, options = {}) {
  const { _retry, ...fetchOptions } = options;
  const token = getAccessToken();

  const headers = {
    ...(fetchOptions.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(buildUrl(path), {
    ...fetchOptions,
    headers
  });

  if (res.status === 401) {
    const isRefreshCall = path === "/api/auth/refresh";
    if (!_retry && !isRefreshCall && (await refreshAccessToken())) {
      return apiFetch(path, { ...fetchOptions, _retry: true });
    }

    clearSession();
    window.location.href = "/login";
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
