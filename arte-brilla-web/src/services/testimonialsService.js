import { apiFetch } from "./api";

export const testimonialsService = {
  // ADMIN
  list: async () => apiFetch("/api/reviews"),
  create: async (payload) =>
    apiFetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  update: async (id, payload) =>
    apiFetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  remove: async (id) => apiFetch(`/api/reviews/${id}`, { method: "DELETE" }),
  togglePublish: async (id, is_published) =>
    apiFetch(`/api/reviews/${id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published }),
    }),

  // PUBLIC (si aplica)
  listPublic: async () => apiFetch("/api/reviews/public"),
};
