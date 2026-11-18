import axios from 'axios';

const TOKEN_KEY = 'skillswap.token';

/** Token persistence. Storage can be unavailable (private mode), so every access is guarded. */
export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

/** Shared HTTP client. Requests go to /api, which Vite (dev) or nginx (Docker) forwards to the API. */
export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let handleUnauthorized = () => {};

/** Lets the auth layer sign the user out when the API rejects their token. */
export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && tokenStore.get()) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

/** Unwraps response data so feature APIs read like plain async functions. */
export const http = {
  get: (url, params) => api.get(url, { params }).then((r) => r.data),
  post: (url, body) => api.post(url, body).then((r) => r.data),
  put: (url, body) => api.put(url, body).then((r) => r.data),
  patch: (url, body) => api.patch(url, body).then((r) => r.data),
  delete: (url) => api.delete(url).then((r) => r.data),
};

/** The API returns RFC 7807 problems: { detail, errors: { field: message } }. */
export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error?.request && !error.response) {
    return 'We could not reach the server. Check your connection and try again.';
  }
  return fallback;
}

export function fieldErrors(error) {
  return error?.response?.data?.errors ?? {};
}

/** Copies server-side field errors onto a react-hook-form form. Returns true if any were applied. */
export function applyFieldErrors(error, setError) {
  const errors = fieldErrors(error);
  const entries = Object.entries(errors);
  entries.forEach(([field, message]) => setError(field, { type: 'server', message }));
  return entries.length > 0;
}
