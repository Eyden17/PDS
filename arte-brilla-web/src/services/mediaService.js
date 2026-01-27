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
  }
};