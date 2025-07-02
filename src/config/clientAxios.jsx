import axios from 'axios';

// Crear el cliente Axios con configuración mejorada
const clientAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor de solicitud para añadir token de autenticación si existe
clientAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken.token) {
          config.headers.Authorization = `Bearer ${parsedToken.token}`;
        }
      } catch (_) {
        // Silenciado: error al procesar el token
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores globalmente
clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return Promise.reject({});
    }

    if (error.message === 'Network Error') {
      return Promise.reject({
        ...error,
        message: 'Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.'
      });
    }

    return Promise.reject(error);
  }
);

export default clientAxios;
