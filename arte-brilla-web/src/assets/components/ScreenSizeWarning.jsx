import React, { useState, useEffect } from 'react';
import '../styles/ScreenSizeWarning.css';

const ScreenSizeWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Detectar si es un dispositivo móvil/táctil
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.matchMedia('(pointer:coarse)').matches
        || ('ontouchstart' in window);
    };

    // Solo mostrar advertencia en dispositivos no móviles
    if (isMobileDevice()) {
      return;
    }

    const handleResize = () => {
      // Mostrar si la ventana es menor a 1000px (solo en desktop)
      setShowWarning(window.innerWidth <= 1000);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="screen-size-warning-fullscreen">
      <div className="warning-content">
        <h1>Pantalla Muy Pequeña</h1>
        <p>Por favor usa un dispositivo con una pantalla más grande.</p>
      </div>
    </div>
  );
};

export default ScreenSizeWarning;
