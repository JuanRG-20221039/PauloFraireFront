import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import './NotificationComponent.css';

const NotificationComponent = () => {
  useEffect(() => {
    const showOfflineToast = () => {
      toast(
        <div className="notification-toast">
          <h4>Sin conexión a internet</h4>
        </div>,
        {
          id: 'offline-status',
          duration: 600000, // mantener visible durante 10 minutos; se dismissea al volver online
          position: 'top-right',
          icon: '⚠️',
        }
      );
    };

    const showOnlineToast = () => {
      toast.dismiss('offline-status');
      toast(
        <div className="notification-toast">
          <h4>Conexión a internet restablecida</h4>
        </div>,
        {
          id: 'online-status',
          duration: 3000,
          position: 'top-right',
          icon: '✅',
        }
      );
    };

    // Probe activo: intenta acceder a un endpoint que devuelve 204 (sin contenido)
    const probeConnectivity = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        // Usamos no-cors para evitar CORS y que SW no intercepte al ser cross-origin
        await fetch('https://www.google.com/generate_204', {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return true; // si resolvió, hay conectividad real
      } catch (_) {
        return false;
      }
    };

    let lastOnline = navigator.onLine;

    // Estado inicial
    const init = async () => {
      if (!navigator.onLine) {
        showOfflineToast();
        lastOnline = false;
        return;
      }
      const ok = await probeConnectivity();
      if (!ok) {
        showOfflineToast();
        lastOnline = false;
      } else {
        lastOnline = true;
      }
    };
    init();

    const handleOffline = () => {
      if (lastOnline !== false) {
        showOfflineToast();
        lastOnline = false;
      }
    };
    const handleOnline = async () => {
      const ok = await probeConnectivity();
      if (ok && lastOnline !== true) {
        showOnlineToast();
        lastOnline = true;
      } else if (!ok && lastOnline !== false) {
        // Volvió la red local pero sin internet, mantenemos estado offline
        showOfflineToast();
        lastOnline = false;
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Chequeo periódico para detectar cambios no capturados por eventos
    const interval = setInterval(async () => {
      const ok = await probeConnectivity();
      if (!ok && lastOnline !== false) {
        showOfflineToast();
        lastOnline = false;
      } else if (ok && lastOnline !== true) {
        showOnlineToast();
        lastOnline = true;
      }
    }, 10000);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      toast.dismiss('offline-status');
      toast.dismiss('online-status');
      clearInterval(interval);
    };
  }, []);

  // No renderizar nada en la interfaz
  return null;
};

export default NotificationComponent;