import { apiFetch } from "./api";

export const paymentService = {
  // POST /api/payments
  createPayment: (paymentData) =>
    apiFetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    }),

  // GET /api/payments/:id
  getPaymentById: (id) => apiFetch(`/api/payments/${id}`),

  // GET /api/payments/monthly-fees/:id
  listPaymentsByMonthlyFee: (monthlyFeeId) =>
    apiFetch(`/api/payments/monthly-fees/${monthlyFeeId}`),
};
