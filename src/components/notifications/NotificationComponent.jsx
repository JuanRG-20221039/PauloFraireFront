import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './NotificationComponent.css';

const NotificationComponent = () => {
  useEffect(() => {
    // Mostrar una notificación local cada 2 segundos, sin llamadas al backend
    const interval = setInterval(() => {
      toast(
        <div className="notification-toast">
          <h4>bienvenido!</h4>
        </div>,
        {
          id: 'bienvenido-toast', // evita acumulación; actualiza el mismo toast
          duration: 1800,
          position: 'top-right',
          icon: '👋',
        }
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // No renderizar nada en la interfaz
  return null;
};

export default NotificationComponent;