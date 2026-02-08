// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Credenciales del dueño (en producción usar backend)
  const ownerCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const session = localStorage.getItem('barbershop_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setIsAuthenticated(true);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('barbershop_session');
      }
    }
  }, []);

  const login = (username, password) => {
    if (username === ownerCredentials.username && password === ownerCredentials.password) {
      const userData = { 
        username, 
        role: 'owner',
        loginTime: new Date().toISOString()
      };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('barbershop_session', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('barbershop_session');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
