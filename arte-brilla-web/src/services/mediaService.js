import { apiFetch } from "./api";

export const mediaService = {
  // POST /api/media/upload
  uploadImage: async (file, { section = 'news', title = null } = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', section);

    if (title) {
      formData.append('title', title);
    }

    return apiFetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });
  },

  deleteMedia: async (id) => {
    if (!id) return { ok: true };

    // Lo “toleramos” aquí para que el front no reviente.
    try {
      return await apiFetch(`/api/media/${id}`, { method: 'DELETE' });
    } catch (e) {
      const msg = String(e?.message || '').toLowerCase();
      if (msg.includes('not found') || msg.includes('404')) {
        return { ok: true };
      }
      throw e;
    }
  }
};