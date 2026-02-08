// src/hooks/useAppointments.js
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

  // Cargar citas
  const loadAppointments = useCallback(() => {
    try {
      setLoading(true);
      const data = getAllAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las citas');
      console.error(err);
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
      const interval = setInterval(loadAppointments, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loadAppointments]);

  // Crear cita
  const addAppointment = useCallback((appointmentData) => {
    try {
      const newAppointment = createAppointment(appointmentData);
      setAppointments(prev => [...prev, newAppointment]);
      return { success: true, appointment: newAppointment };
    } catch (err) {
      setError('Error al crear la cita');
      console.error(err);
      return { success: false, error: err.message };
    }
  }, []);

  // Actualizar estado
  const changeStatus = useCallback((id, newStatus, rejectionReason) => {
    try {
      const updated = updateAppointmentStatus(id, newStatus, rejectionReason);
      if (updated) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? updated : apt)
        );
        return { success: true, appointment: updated };
      }
      return { success: false, error: 'Cita no encontrada' };
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
      return { success: false, error: err.message };
    }
  }, []);

  // Actualizar cita
  const modifyAppointment = useCallback((id, updates) => {
    try {
      const updated = updateAppointment(id, updates);
      if (updated) {
        setAppointments(prev => 
          prev.map(apt => apt.id === id ? updated : apt)
        );
        return { success: true, appointment: updated };
      }
      return { success: false, error: 'Cita no encontrada' };
    } catch (err) {
      setError('Error al actualizar la cita');
      console.error(err);
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar cita
  const removeAppointment = useCallback((id) => {
    try {
      const success = deleteAppointment(id);
      if (success) {
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        return { success: true };
      }
      return { success: false, error: 'Error al eliminar' };
    } catch (err) {
      setError('Error al eliminar la cita');
      console.error(err);
      return { success: false, error: err.message };
    }
  }, []);

  // Obtener citas de cliente
  const getByClient = useCallback((identifier) => {
    return getClientAppointments(identifier);
  }, []);

  // Obtener citas por fecha
  const getByDate = useCallback((date) => {
    return getAppointmentsByDate(date);
  }, []);

  // Obtener estadísticas
  const getStats = useCallback(() => {
    return getAppointmentStats();
  }, []);

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
    getStats
  };
};
