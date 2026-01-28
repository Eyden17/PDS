import React, { useState, useEffect } from 'react';
import '../styles/ScreenSizeWarning.css';

const ScreenSizeWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Mostrar si la ventana es menor a 1000px
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
