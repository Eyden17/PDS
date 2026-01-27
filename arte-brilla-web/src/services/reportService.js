// src/services/reportService.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
import { apiFetch } from './api.js';

export const reportService = {
  // GET /api/reports/cobranza?year=YYYY&month=MM&group=Babies&only_debtors=false
  getCobranza: async ({ year, month, group = null, onlyDebtors = false, limit = 500, offset = 0 }) => {
    const params = new URLSearchParams();
    params.set('year', String(year));
    params.set('month', String(month));
    if (group) params.set('group', group);
    params.set('only_debtors', String(onlyDebtors));
    params.set('limit', String(limit));
    params.set('offset', String(offset));

    return apiFetch(`/api/reports/cobranza?${params.toString()}`);
  },
};
