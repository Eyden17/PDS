import { apiFetch } from "./api";

export const classService = {
  list: ({ q = null, active = null, limit = 100, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (active !== null && active !== undefined) params.set("active", String(active));
    params.set("limit", String(limit));
    params.set("offset", String(offset));

    return apiFetch(`/api/classes?${params.toString()}`);
  },

  getById: (id) => apiFetch(`/api/classes/${id}`),

  create: (payload) =>
    apiFetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiFetch(`/api/classes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiFetch(`/api/classes/${id}`, {
      method: "DELETE",
    }),

  listTeachers: async () => apiFetch("/api/users/teachers"),

  listGroups: async () => {
    return apiFetch("/api/groups", { method: "GET" });
  },

  listStudents: (classId) =>
    apiFetch(`/api/classes/${classId}/students`),

  saveStudents: (classId, payload) =>
    apiFetch(`/api/classes/${classId}/students`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

};

