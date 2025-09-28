import axios from 'axios';

// URL base del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para incluir cookies HttpOnly
});

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
