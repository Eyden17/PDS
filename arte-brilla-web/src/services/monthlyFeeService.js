import { apiFetch } from "./api";

export const monthlyFeeService = {
  // GET /api/monthly-fees?year=&month=&group_id=&search=
  listFeesForMonth: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.year != null) qs.set("year", String(params.year));
    if (params.month != null) qs.set("month", String(params.month));
    if (params.group_id != null) qs.set("group_id", String(params.group_id));
    if (params.search != null && String(params.search).trim() !== "") qs.set("search", String(params.search));
    const q = qs.toString();
    return apiFetch(`/api/monthly-fees${q ? `?${q}` : ""}`);
  },

  // GET /api/monthly-fees/student/:id
  getStudentFees: (studentId) =>
    apiFetch(`/api/monthly-fees/student/${studentId}`),

  // GET /api/monthly-fees/:id
  getFeeById: (id) =>
    apiFetch(`/api/monthly-fees/${id}`),

  // POST /api/monthly-fees/generate (todos)
  generateFees: (year, month, amount) =>
    apiFetch("/api/monthly-fees/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, month, amount }),
    }),

  // POST /api/monthly-fees/generate-by-group (por grupo)
  generateFeesByGroup: ({ group_id, amount_due, year, month, notes, overwrite } = {}) =>
    apiFetch("/api/monthly-fees/generate-by-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ group_id, amount_due, year, month, notes, overwrite }),
    }),

  // GET /api/monthly-fees/status
  getMonthlyFeeStatus: () =>
    apiFetch("/api/monthly-fees/status"),
};
