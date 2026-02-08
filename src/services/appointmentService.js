// src/services/appointmentService.js
import { appointmentStatuses } from './servicesData';

const APPOINTMENTS_KEY = 'barbershop_appointments';

// Generar ID único para cita
export const generateAppointmentId = () => {
  return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Obtener todas las citas
export const getAllAppointments = () => {
  try {
    const appointments = localStorage.getItem(APPOINTMENTS_KEY);
    return appointments ? JSON.parse(appointments) : [];
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return [];
  }
};

// Guardar todas las citas
export const saveAllAppointments = (appointments) => {
  try {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return true;
  } catch (error) {
    console.error('Error al guardar citas:', error);
    return false;
  }
};

// Crear nueva cita
export const createAppointment = (appointmentData) => {
  const appointments = getAllAppointments();
  const newAppointment = {
    id: generateAppointmentId(),
    ...appointmentData,
    status: appointmentStatuses.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  saveAllAppointments(appointments);
  return newAppointment;
};

// Obtener cita por ID
export const getAppointmentById = (id) => {
  const appointments = getAllAppointments();
  return appointments.find(apt => apt.id === id);
};

// Obtener citas de un cliente por email o teléfono
export const getClientAppointments = (identifier) => {
  const appointments = getAllAppointments();
  return appointments.filter(apt => 
    apt.clientEmail === identifier || apt.clientPhone === identifier
  );
};

// Actualizar estado de cita
export const updateAppointmentStatus = (id, newStatus, rejectionReason = '') => {
  const appointments = getAllAppointments();
  const index = appointments.findIndex(apt => apt.id === id);
  
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(rejectionReason && { rejectionReason })
    };
    saveAllAppointments(appointments);
    return appointments[index];
  }
  return null;
};

// Actualizar cita completa
export const updateAppointment = (id, updates) => {
  const appointments = getAllAppointments();
  const index = appointments.findIndex(apt => apt.id === id);
  
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveAllAppointments(appointments);
    return appointments[index];
  }
  return null;
};

// Eliminar cita
export const deleteAppointment = (id) => {
  const appointments = getAllAppointments();
  const filtered = appointments.filter(apt => apt.id !== id);
  saveAllAppointments(filtered);
  return filtered.length < appointments.length;
};

// Obtener citas por fecha
export const getAppointmentsByDate = (date) => {
  const appointments = getAllAppointments();
  return appointments.filter(apt => apt.date === date);
};

// Obtener citas por rango de fechas
export const getAppointmentsByDateRange = (startDate, endDate) => {
  const appointments = getAllAppointments();
  return appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return aptDate >= start && aptDate <= end;
  });
};

// Verificar disponibilidad de horario
export const isTimeSlotAvailable = (date, time, duration, excludeId = null) => {
  const appointments = getAppointmentsByDate(date);
  const activeAppointments = appointments.filter(apt => 
    apt.status !== appointmentStatuses.CANCELLED && 
    apt.status !== appointmentStatuses.REJECTED &&
    apt.id !== excludeId
  );

  const [hours, minutes] = time.split(':').map(Number);
  const requestedStart = hours * 60 + minutes;
  const requestedEnd = requestedStart + duration;

  for (const apt of activeAppointments) {
    const [aptHours, aptMinutes] = apt.time.split(':').map(Number);
    const aptStart = aptHours * 60 + aptMinutes;
    const aptEnd = aptStart + apt.duration;

    // Verificar si hay solapamiento
    if (
      (requestedStart >= aptStart && requestedStart < aptEnd) ||
      (requestedEnd > aptStart && requestedEnd <= aptEnd) ||
      (requestedStart <= aptStart && requestedEnd >= aptEnd)
    ) {
      return false;
    }
  }

  return true;
};

// Obtener estadísticas
export const getAppointmentStats = () => {
  const appointments = getAllAppointments();
  const today = new Date().toISOString().split('T')[0];

  return {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === appointmentStatuses.PENDING).length,
    confirmed: appointments.filter(apt => apt.status === appointmentStatuses.CONFIRMED).length,
    completed: appointments.filter(apt => apt.status === appointmentStatuses.COMPLETED).length,
    rejected: appointments.filter(apt => apt.status === appointmentStatuses.REJECTED).length,
    cancelled: appointments.filter(apt => apt.status === appointmentStatuses.CANCELLED).length,
    today: appointments.filter(apt => apt.date === today).length
  };
};

// Limpiar citas antiguas (opcional)
export const cleanOldAppointments = (daysOld = 90) => {
  const appointments = getAllAppointments();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const filtered = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= cutoffDate || apt.status === appointmentStatuses.PENDING;
  });

  saveAllAppointments(filtered);
  return appointments.length - filtered.length;
};
