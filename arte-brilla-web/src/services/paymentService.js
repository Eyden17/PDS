// src/services/paymentService.js
import { apiFetch } from './api';

export const paymentService = {
  // POST /api/payments
  createPayment: async (paymentData) => {
    return apiFetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
  },

  // GET /api/payments/:id
  getPaymentById: async (id) => {
    return apiFetch(`/api/payments/${id}`);
  },

  // GET /api/payments/monthly-fees/:id
  listPaymentsByMonthlyFee: async (monthlyFeeId) => {
    return apiFetch(`/api/payments/monthly-fees/${monthlyFeeId}`);
  }
};
