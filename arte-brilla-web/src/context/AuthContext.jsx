import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextProvider';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Contraseña maestra para admin (en producción, esto vendría de un backend)
  const ADMIN_PASSWORD = 'AdminArteBrilla2025';

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAdminAuthenticated');
    
    // Usar un callback para evitar cascading renders
    const initAuth = () => {
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
        setUser({ role: 'admin' });
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setUser({ role: 'admin' });
      localStorage.setItem('isAdminAuthenticated', 'true');
      return { success: true };
    }
    return { success: false, message: 'Contraseña incorrecta' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAdminAuthenticated');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


