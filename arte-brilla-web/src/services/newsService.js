import { apiFetch } from "./api";

export const newsService = {
  // POST /api/news
  createNews: async (newsData) => {
    return apiFetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
  },

  // PUT /api/news/:id
  updateNews: async (id, newsData) => {
    return apiFetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsData)
    });
  },

  // DELETE /api/news/:id
  deleteNews: async (id) => {
    return apiFetch(`/api/news/${id}`, {
      method: 'DELETE'
    });
  }
}