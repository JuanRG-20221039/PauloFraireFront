import React, { useState, useEffect, createContext, useContext } from 'react';

// Crear un contexto para la ubicación
export const LocationContext = createContext(null);

// Hook personalizado para acceder a la ubicación desde cualquier componente
export const useLocation = () => useContext(LocationContext);

// Proveedor del contexto de ubicación
export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  // Función para solicitar permiso y obtener la ubicación
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es compatible con este navegador.');
      return;
    }

    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setPermissionStatus('granted');
      },
      (err) => {
        setError(`Error al obtener la ubicación: ${err.message}`);
        setPermissionStatus(err.code === 1 ? 'denied' : 'prompt');
      },
      { enableHighAccuracy: true }
    );
  };

  // Solicitar ubicación automáticamente al cargar el componente
  useEffect(() => {
    // Solicitar ubicación inmediatamente al cargar
    requestLocation();
    
    // También verificar el estado del permiso
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setPermissionStatus(result.state);
          
          // Escuchar cambios en el estado del permiso
          result.onchange = () => {
            setPermissionStatus(result.state);
            if (result.state === 'granted') {
              requestLocation();
            }
          };
        });
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, error, permissionStatus }}>
      {children}
    </LocationContext.Provider>
  );
};

// Componente de visualización de la ubicación (opcional, puede ocultarse)
const Geolocation = () => {
  const { location, error } = useLocation();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ubicación del Usuario</h2>
      
      {error && (
        <div className="mt-3 text-red-500">
          {error}
        </div>
      )}
      
      {location && (
        <div className="mt-3">
          <p className="font-medium">Ubicación actual:</p>
          <p>Latitud: {location.latitude}</p>
          <p>Longitud: {location.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default Geolocation;