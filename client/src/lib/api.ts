/**
 * mySeals API Client
 * Centralized axios instance that automatically attaches Auth0 Bearer tokens
 * to every request and handles common error patterns.
 */

import axios from "axios";

// Base URL for the mySeals Spring Boot backend
// In production this should be the Render deployment URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// Create a shared axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Render free tier can take up to 60s to wake from sleep — generous timeout
  timeout: 70000,
});

// Token setter — called from Auth0 hook after login
let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

// Request interceptor — attach Bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ─── Typed API helpers ───────────────────────────────────────────────────────

// Users
export const usersApi = {
  getAll: () => apiClient.get("/users"),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  create: (data: unknown) => apiClient.post("/users", data),
  update: (id: string, data: unknown) => apiClient.put(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};

// Offices
export const officesApi = {
  getAll: () => apiClient.get("/offices"),
  getById: (id: string) => apiClient.get(`/offices/${id}`),
  create: (data: unknown) => apiClient.post("/offices", data),
  update: (id: string, data: unknown) => apiClient.put(`/offices/${id}`, data),
};

// Roles
export const rolesApi = {
  getAll: () => apiClient.get("/roles"),
};

// Seal Batches
export const sealBatchesApi = {
  getAll: () => apiClient.get("/seal-batches"),
  getById: (id: string) => apiClient.get(`/seal-batches/${id}`),
  create: (data: unknown) => apiClient.post("/seal-batches", data),
  update: (id: string, data: unknown) =>
    apiClient.put(`/seal-batches/${id}`, data),
};

// Seals
export const sealsApi = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get("/seals", { params }),
  getById: (id: string) => apiClient.get(`/seals/${id}`),
  create: (data: unknown) => apiClient.post("/seals", data),
  update: (id: string, data: unknown) => apiClient.put(`/seals/${id}`, data),
  getByStatus: (status: string) =>
    apiClient.get("/seals", { params: { status } }),
};

// Seal Assignments
export const assignmentsApi = {
  getAll: () => apiClient.get("/seal-assignments"),
  getById: (id: string) => apiClient.get(`/seal-assignments/${id}`),
  create: (data: unknown) => apiClient.post("/seal-assignments", data),
  update: (id: string, data: unknown) =>
    apiClient.put(`/seal-assignments/${id}`, data),
};

// Seal Usage
export const sealUsageApi = {
  getAll: () => apiClient.get("/seal-usage"),
  getById: (id: string) => apiClient.get(`/seal-usage/${id}`),
  create: (data: unknown) => apiClient.post("/seal-usage", data),
};

// Stock Movements
export const stockMovementsApi = {
  getAll: () => apiClient.get("/stock-movements"),
  getById: (id: string) => apiClient.get(`/stock-movements/${id}`),
  create: (data: unknown) => apiClient.post("/stock-movements", data),
};

// Audit Logs
export const auditLogsApi = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get("/audit-logs", { params }),
  getById: (id: string) => apiClient.get(`/audit-logs/${id}`),
};
