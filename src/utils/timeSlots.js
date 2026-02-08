// src/utils/timeSlots.js
import { businessInfo } from '../services/servicesData';
import { isTimeSlotAvailable } from '../services/appointmentService';

// Convertir "HH:MM" a minutos
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convertir minutos a "HH:MM"
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Obtener día de la semana
export const getDayOfWeek = (date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dateObj = new Date(date + 'T00:00:00');
  return days[dateObj.getDay()];
};

// Generar horarios disponibles para una fecha
export const generateAvailableSlots = (date, duration = 30) => {
  const dayOfWeek = getDayOfWeek(date);
  const daySchedule = businessInfo.workingHours[dayOfWeek];

  // Si el día está cerrado
  if (daySchedule.closed) {
    return [];
  }

  const startMinutes = timeToMinutes(daySchedule.start);
  const endMinutes = timeToMinutes(daySchedule.end);
  const breakStart = timeToMinutes(businessInfo.breakTime.start);
  const breakEnd = timeToMinutes(businessInfo.breakTime.end);

  const slots = [];
  let currentMinutes = startMinutes;

  while (currentMinutes + duration <= endMinutes) {
    // Saltar hora de comida
    if (currentMinutes >= breakStart && currentMinutes < breakEnd) {
      currentMinutes = breakEnd;
      continue;
    }

    const timeSlot = minutesToTime(currentMinutes);
    
    // Verificar disponibilidad
    const isAvailable = isTimeSlotAvailable(date, timeSlot, duration);

    slots.push({
      time: timeSlot,
      available: isAvailable,
      formatted: formatTime(timeSlot)
    });

    currentMinutes += businessInfo.slotDuration;
  }

  return slots;
};

// Formatear hora para mostrar (12 horas)
export const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Formatear fecha
export const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-MX', options);
};

// Verificar si una fecha es válida para agendar
export const isValidBookingDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(date + 'T00:00:00');
  
  // No permitir fechas pasadas
  if (selectedDate < today) {
    return false;
  }

  // Verificar si el día está abierto
  const dayOfWeek = getDayOfWeek(date);
  const daySchedule = businessInfo.workingHours[dayOfWeek];
  
  return !daySchedule.closed;
};

// Obtener próximos N días disponibles
export const getNextAvailableDays = (count = 14) => {
  const days = [];
  const today = new Date();
  
  let currentDate = new Date(today);
  let addedDays = 0;

  while (addedDays < count) {
    const dateString = currentDate.toISOString().split('T')[0];
    
    if (isValidBookingDate(dateString)) {
      days.push({
        date: dateString,
        formatted: formatDate(dateString),
        dayOfWeek: getDayOfWeek(dateString)
      });
      addedDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};
