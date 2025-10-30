import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import clientAxios from '../../config/clientAxios';
import './NotificationComponent.css';

const NotificationComponent = () => {
  const [lastNotificationId, setLastNotificationId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await clientAxios.get('/notify');
        const activeNotifications = data.filter(notif => notif.estado === 'VIGENTE');
        
        if (activeNotifications.length > 0) {
          const latestNotification = activeNotifications[0];
          
          // Solo mostrar notificación si es nueva (no mostrada anteriormente)
          if (latestNotification._id !== lastNotificationId) {
            setLastNotificationId(latestNotification._id);
            
            // Mostrar toast de notificación
            toast(
              <div className="notification-toast">
                <h4>{latestNotification.titulo}</h4>
                <p>{latestNotification.resumen}</p>
              </div>,
              {
                duration: 5000,
                position: 'top-right',
                icon: '🔔',
              }
            );
          }
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    };

    // Ejecutar inmediatamente al cargar
    fetchNotifications();
    
    // Configurar intervalo para actualizar notificaciones cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [lastNotificationId]);

  // No renderizar nada en la interfaz
  return null;
};

export default NotificationComponent;