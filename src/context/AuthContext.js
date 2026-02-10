// src/context/AuthContext.js
// Sistema de autenticación mejorado con seguridad

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
  const [sessionToken, setSessionToken] = useState(null);

  // Credenciales del dueño
  const ownerCredentials = {
    username: 'Sr_Man',
    password: 'Man123.' // CÁMBIALO en producción
  };

  // Tiempo de inactividad antes de cerrar sesión (15 minutos)
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos en milisegundos
  const SESSION_KEY = 'barbershop_session';
  const SESSION_TOKEN_KEY = 'barbershop_token';
  const LAST_ACTIVITY_KEY = 'barbershop_last_activity';

  // Generar token único de sesión
  const generateSessionToken = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Verificar si la sesión es válida
  const isSessionValid = () => {
    const savedToken = localStorage.getItem(SESSION_TOKEN_KEY);
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    
    if (!savedToken || !lastActivity) {
      return false;
    }

    const timeSinceActivity = Date.now() - parseInt(lastActivity);
    
    // Si pasaron más de 15 minutos de inactividad, cerrar sesión
    if (timeSinceActivity > INACTIVITY_TIMEOUT) {
      return false;
    }

    // Verificar que el token coincida con el de la sesión actual
    return savedToken === sessionToken;
  };

  // Actualizar última actividad
  const updateActivity = () => {
    if (isAuthenticated) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  };

  // Verificar sesión al cargar
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
    
    if (session && token && lastActivity) {
      try {
        const userData = JSON.parse(session);
        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        
        // Si la sesión es reciente (menos de 15 min), restaurarla
        if (timeSinceActivity < INACTIVITY_TIMEOUT) {
          setIsAuthenticated(true);
          setUser(userData);
          setSessionToken(token);
          updateActivity();
        } else {
          // Sesión expirada
          clearSession();
        }
      } catch (error) {
        clearSession();
      }
    }
  }, []);

  // Detectar inactividad y actividad del usuario
  useEffect(() => {
    if (!isAuthenticated) return;

    // Actualizar actividad en cada interacción
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Verificar inactividad cada minuto
    const inactivityCheck = setInterval(() => {
      if (!isSessionValid()) {
        logout('Sesión cerrada por inactividad');
      }
    }, 60000); // Cada minuto

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [isAuthenticated, sessionToken]);

  // Limpiar sesión
  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setIsAuthenticated(false);
    setUser(null);
    setSessionToken(null);
  };

  // Login
  const login = (username, password) => {
    if (username === ownerCredentials.username && password === ownerCredentials.password) {
      const token = generateSessionToken();
      const userData = { 
        username, 
        role: 'owner',
        loginTime: new Date().toISOString()
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      setSessionToken(token);
      
      // Guardar en localStorage
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      localStorage.setItem(SESSION_TOKEN_KEY, token);
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      
      return true;
    }
    return false;
  };

  // Logout
  const logout = (reason) => {
    clearSession();
    if (reason) {
      alert(reason);
    }
  };

  // Verificar si el usuario actual es admin
  const isAdmin = () => {
    return isAuthenticated && user?.role === 'owner' && isSessionValid();
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    isAdmin,
    updateActivity
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
