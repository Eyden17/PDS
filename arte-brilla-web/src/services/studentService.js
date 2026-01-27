// src/services/studentService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import { apiFetch } from './api.js';

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
    // POST /api/students
    return apiFetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
  },

  updateStudent: async (id, studentData) => {
    // PUT /api/students/:id
    return apiFetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
  },

  deleteStudent: async (id) => {
    // DELETE /api/students/:id
    return apiFetch(`/api/students/${id}`, { method: 'DELETE' });
  }
};
