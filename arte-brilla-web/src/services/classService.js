// src/services/classService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import { apiFetch } from './api.js';

export const classService = {
  // GET /api/classes?...
  getAllClasses: async ({ q = '', active = null, limit = 50, offset = 0 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (active !== null) params.set('active', String(active));
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    return apiFetch(`/api/classes?${params.toString()}`);
  },

  // GET /api/classes/:id
  getClassById: (id) =>
    apiFetch(`/api/classes/${id}`),

  // POST /api/classes
  createClass: (classData) =>
    apiFetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    }),
  
  // PUT /api/classes/:id
  updateClass: (id, classData) =>
    apiFetch(`/api/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classData)
    }),

  // DELETE /api/classes/:id
  deleteClass: (id) =>
    apiFetch(`/api/classes/${id}`, {
      method: 'DELETE'
    }),

  // -------------------- Class Enrollments --------------------

  // POST /api/classes/:id/enroll
  enrollStudent: (classId, studentId) =>
    apiFetch(`/api/class-enrollments/classes/${classId}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    }),

  // POST /api/classes/:id/unenroll
  unenrollStudent: (classId, studentId) =>
    apiFetch(`/api/class-enrollments/classes/${classId}/unenroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    }),
  
  // GET /api/classes/:id/students
  getClassStudents: (classId) =>
    apiFetch(`/api/class-enrollments/classes/${classId}/students`),

  // GET /api/students/:id/classes
  getStudentClasses: (studentId) => 
    apiFetch(`/api/class-enrollments/students/${studentId}/classes`),
}