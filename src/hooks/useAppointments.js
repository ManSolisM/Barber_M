// src/hooks/useAppointments.js
// Hook actualizado que verifica permisos de admin

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
import { useAuth } from '../context/AuthContext';

export const useAppointments = (autoRefresh = true) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  // Cargar citas
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

  // Efecto inicial
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Auto-refresh cada 30 segundos si está activado
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAppointments();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadAppointments]);

  // Crear cita (cualquiera puede)
  const addAppointment = useCallback(async (appointmentData) => {
    try {
      const newAppointment = await createAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      return { success: true, appointment: newAppointment };
    } catch (err) {
      setError('Error al crear la cita');
      console.error('Error en addAppointment:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // Actualizar estado de cita (SOLO ADMIN)
  const changeStatus = useCallback(async (id, newStatus, rejectionReason = '') => {
    try {
      // Verificar que sea admin
      const adminCheck = isAdmin();
      if (!adminCheck) {
        throw new Error('No tienes permisos. Debes iniciar sesión como administrador.');
      }

      const updated = await updateAppointmentStatus(id, newStatus, rejectionReason, true);
      
      if (updated) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? updated : apt)
        );
        return { success: true, appointment: updated };
      }
      
      return { success: false, error: 'Cita no encontrada' };
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado');
      console.error('Error en changeStatus:', err);
      return { success: false, error: err.message };
    }
  }, [isAdmin]);

  // Modificar cita (SOLO ADMIN)
  const modifyAppointment = useCallback(async (id, updates) => {
    try {
      const adminCheck = isAdmin();
      if (!adminCheck) {
        throw new Error('No tienes permisos. Debes iniciar sesión como administrador.');
      }

      const updated = await updateAppointment(id, updates, true);
      
      if (updated) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? updated : apt)
        );
        return { success: true, appointment: updated };
      }
      
      return { success: false, error: 'Cita no encontrada' };
    } catch (err) {
      setError(err.message || 'Error al actualizar la cita');
      console.error('Error en modifyAppointment:', err);
      return { success: false, error: err.message };
    }
  }, [isAdmin]);

  // Eliminar cita (SOLO ADMIN)
  const removeAppointment = useCallback(async (id) => {
    try {
      const adminCheck = isAdmin();
      if (!adminCheck) {
        throw new Error('No tienes permisos. Debes iniciar sesión como administrador.');
      }

      const success = await deleteAppointment(id, true);
      
      if (success) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        return { success: true };
      }
      
      return { success: false, error: 'Error al eliminar' };
    } catch (err) {
      setError(err.message || 'Error al eliminar la cita');
      console.error('Error en removeAppointment:', err);
      return { success: false, error: err.message };
    }
  }, [isAdmin]);

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
    appointments,
    loading,
    error,
    loadAppointments,
    addAppointment,
    changeStatus,
    modifyAppointment,
    removeAppointment,
    getByClient,
    getByDate,
    getStats,
    refresh
  };
};

export default useAppointments;
