import { apiFetch } from "./api";

export const guardianService = {
  // GET /api/guardians?...
  getAllGuardians: async ({ q = '', limit = 100, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    return apiFetch(`/api/guardians?${params.toString()}`);
  },

  // GET /api/guardians/:id
  getGuardianById: (id) =>
    apiFetch(`/api/guardians/${id}`),

  // POST /api/guardians
  createGuardian: (guardianData) =>
    apiFetch('/api/guardians', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guardianData)
    }),
  
  // PATCH /api/guardians/:id
  updateGuardian: (id, guardianData) =>
    apiFetch(`/api/guardians/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guardianData)
    }),

  // DELETE /api/guardians/:id
  deleteGuardian: (id) =>
    apiFetch(`/api/guardians/${id}`, {
      method: 'DELETE'
    })
}