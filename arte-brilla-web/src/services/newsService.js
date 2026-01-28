import { apiFetch } from "./api";

export const newsService = {
  // ADMIN
  list: async () => apiFetch('/api/news'),
  create: async (payload) =>
    apiFetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }),
  getById: (id) => apiFetch(`/api/news/${id}`),
  update: async (id, payload) =>
    apiFetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }),
  remove: async (id) => apiFetch(`/api/news/${id}`, { method: 'DELETE' }),
  togglePublish: async (id, publish) =>
    apiFetch(`/api/news/${id}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publish })
    }),

  // HOME (si luego lo ocupás)
  listPublic: async () => apiFetch('/api/news/public')
};