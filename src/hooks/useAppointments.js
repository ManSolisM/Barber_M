// src/hooks/useAppointments.js
// Hook personalizado para gestionar citas con async/await (compatible con Firebase)

import { useState, useEffect, useCallback } from 'react';
import {
  getAllAppointments,
  createAppointment,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment,
  getClientAppointments,
  getAppointmentsByDate,
  getAppointmentStats
} from '../services/appointmentService';

export const useAppointments = (autoRefresh = true) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar citas (ahora con async/await)
  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAppointments();
      setAppointments(data);
    } catch (err) {
      setError('Error al cargar las citas');
      console.error('Error en loadAppointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto inicial - cargar citas al montar
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Auto-refresh cada 30 segundos si está activado
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAppointments();
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadAppointments]);

  // Crear cita (async)
  const addAppointment = useCallback(async (appointmentData) => {
    try {
      const newAppointment = await createAppointment(appointmentData);
      
      // Actualizar estado local inmediatamente
      setAppointments(prev => [...prev, newAppointment]);
      
      return { success: true, appointment: newAppointment };
    } catch (err) {
      setError('Error al crear la cita');
      console.error('Error en addAppointment:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Actualizar estado de cita (async)
  const changeStatus = useCallback(async (id, newStatus, rejectionReason = '') => {
    try {
      const updated = await updateAppointmentStatus(id, newStatus, rejectionReason);
      
      if (updated) {
        // Actualizar estado local
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? updated : apt)
        );
        return { success: true, appointment: updated };
      }
      
      return { success: false, error: 'Cita no encontrada' };
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error('Error en changeStatus:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Modificar cita (async)
  const modifyAppointment = useCallback(async (id, updates) => {
    try {
      const updated = await updateAppointment(id, updates);
      
      if (updated) {
        // Actualizar estado local
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? updated : apt)
        );
        return { success: true, appointment: updated };
      }
      
      return { success: false, error: 'Cita no encontrada' };
    } catch (err) {
      setError('Error al actualizar la cita');
      console.error('Error en modifyAppointment:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar cita (async)
  const removeAppointment = useCallback(async (id) => {
    try {
      const success = await deleteAppointment(id);
      
      if (success) {
        // Actualizar estado local
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        return { success: true };
      }
      
      return { success: false, error: 'Error al eliminar' };
    } catch (err) {
      setError('Error al eliminar la cita');
      console.error('Error en removeAppointment:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Obtener citas de un cliente (async)
  const getByClient = useCallback(async (identifier) => {
    try {
      const clientAppointments = await getClientAppointments(identifier);
      return clientAppointments;
    } catch (err) {
      console.error('Error en getByClient:', err);
      return [];
    }
  }, []);

  // Obtener citas por fecha (async)
  const getByDate = useCallback(async (date) => {
    try {
      const dateAppointments = await getAppointmentsByDate(date);
      return dateAppointments;
    } catch (err) {
      console.error('Error en getByDate:', err);
      return [];
    }
  }, []);

  // Obtener estadísticas (async)
  const getStats = useCallback(async () => {
    try {
      const stats = await getAppointmentStats();
      return stats;
    } catch (err) {
      console.error('Error en getStats:', err);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        rejected: 0,
        cancelled: 0,
        today: 0
      };
    }
  }, []);

  // Refrescar datos manualmente
  const refresh = useCallback(() => {
    return loadAppointments();
  }, [loadAppointments]);

  return {
    // Estado
    appointments,
    loading,
    error,
    
    // Funciones principales
    loadAppointments,
    addAppointment,
    changeStatus,
    modifyAppointment,
    removeAppointment,
    
    // Funciones de consulta
    getByClient,
    getByDate,
    getStats,
    
    // Utilidades
    refresh
  };
};

// Hook simplificado para solo lectura
export const useAppointmentsReadOnly = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAllAppointments();
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las citas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading, error };
};

// Hook para obtener citas de un cliente específico
export const useClientAppointments = (identifier) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientAppointments = useCallback(async () => {
    if (!identifier) {
      setAppointments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getClientAppointments(identifier);
      setAppointments(data);
    } catch (err) {
      setError('Error al cargar las citas del cliente');
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    fetchClientAppointments();
  }, [fetchClientAppointments]);

  return { 
    appointments, 
    loading, 
    error,
    refresh: fetchClientAppointments 
  };
};

// Hook para estadísticas en tiempo real
export const useAppointmentStats = (autoRefresh = true) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
    today: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAppointmentStats();
      setStats(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh cada minuto si está activado
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 60000); // 1 minuto
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
};

export default useAppointments;