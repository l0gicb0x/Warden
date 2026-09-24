import axios from 'axios';
import { supabase } from './supabase.js';
import { normalizeError } from './errors.js';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase JWT bearer token to outgoing requests if session exists
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore auth session fetch errors; request proceeds unauthenticated
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// Unwrap response payload and normalize errors to DataError instances
apiClient.interceptors.response.use(
  (response) => {
    const resData = response.data;
    if (resData && typeof resData === 'object' && 'success' in resData) {
      if (!resData.success) {
        return Promise.reject(normalizeError(resData));
      }
      return resData.data !== undefined ? resData.data : resData;
    }
    return resData;
  },
  (error) => {
    return Promise.reject(normalizeError(error));
  }
);
