import { apiFetch } from "./api";

export const monthlyFeeService = {
  // GET /api/monthly-fees/student/:id
  getStudentFees: (studentId) => 
    apiFetch(`/api/monthly-fees/student/${studentId}`),

  // GET /api/monthly-fees/:id
  getFeeById: (id) => 
    apiFetch(`/api/monthly-fees/${id}`),

  // POST /api/monthly-fees/generate
  generateFees: (year, month, amount) =>
    apiFetch('/api/monthly-fees/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, month, amount })
    })
};