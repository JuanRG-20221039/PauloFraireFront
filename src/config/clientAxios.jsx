import axios from 'axios';

// Crear el cliente Axios con configuración mejorada
const clientAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  // baseURL: `https://paulo-freire-backend.vercel.app/api` // Si prefieres usar la URL estática
  timeout: 15000, // Timeout de 15 segundos para todas las peticiones
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
      } catch (error) {
        console.error('Error al procesar el token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores globalmente
clientAxios.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la devuelve tal cual
  (error) => {
    // Manejo específico para errores de timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.');
      return Promise.reject({
        ...error,
        message: 'La solicitud ha excedido el tiempo de espera. Por favor, inténtalo de nuevo.'
      });
    }
    
    // Si el error es de conexión
    if (error.message === 'Network Error') {
      console.error('Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.');
      return Promise.reject({
        ...error,
        message: 'Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.'
      });
    }
    
    // Para otros errores, solo propaga el error
    return Promise.reject(error);
  }
);

export default clientAxios;
