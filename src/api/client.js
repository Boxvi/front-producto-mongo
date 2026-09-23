// src/api/client.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8082/api/v2',
  timeout: 10000,
});

// Helper uniforme: { success, data, message }
export function unwrap(response) {
  const body = response.data || {};
  return {
    success: body.success ?? true,
    data: body.data ?? body,
    message: body.message ?? '',
  };
}

// Helper para arrays (categorías devuelven data como array)
export function unwrapList(response) {
  const body = response.data || {};
  const data = Array.isArray(body.data) ? body.data : Array.isArray(body) ? body : [];
  return { success: body.success ?? true, data, message: body.message ?? '' };
}