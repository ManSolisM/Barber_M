// src/services/appointmentService.js
// Servicio de gestión de citas con Firebase Firestore.

import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { appointmentStatuses } from './servicesData';

const APPOINTMENTS_COLLECTION = 'appointments';

// Generar ID único para cita
export const generateAppointmentId = () => {
  return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Obtener todas las citas
export const getAllAppointments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, APPOINTMENTS_COLLECTION));
    const appointments = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convertir Timestamps a strings
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });
    return appointments;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return [];
  }
};

// Crear nueva cita
export const createAppointment = async (appointmentData) => {
  try {
    const newAppointment = {
      appointmentId: generateAppointmentId(),
      ...appointmentData,
      status: appointmentStatuses.PENDING,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), newAppointment);
    
    return {
      id: docRef.id,
      ...newAppointment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error al crear cita:', error);
    throw error;
  }
};

// Obtener cita por ID
export const getAppointmentById = async (id) => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener cita:', error);
    return null;
  }
};

// Obtener citas de un cliente por email o teléfono
export const getClientAppointments = async (identifier) => {
  try {
    // Buscar por email
    const qEmail = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('clientEmail', '==', identifier)
    );
    
    // Buscar por teléfono
    const qPhone = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('clientPhone', '==', identifier)
    );
    
    const [emailResults, phoneResults] = await Promise.all([
      getDocs(qEmail),
      getDocs(qPhone)
    ]);
    
    // Usar Map para evitar duplicados
    const appointmentsMap = new Map();
    
    emailResults.docs.forEach(doc => {
      const data = doc.data();
      appointmentsMap.set(doc.id, {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      });
    });
    
    phoneResults.docs.forEach(doc => {
      const data = doc.data();
      appointmentsMap.set(doc.id, {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      });
    });
    
    return Array.from(appointmentsMap.values());
  } catch (error) {
    console.error('Error al obtener citas del cliente:', error);
    return [];
  }
};

// Actualizar estado de cita
export const updateAppointmentStatus = async (id, newStatus, rejectionReason = '') => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const updateData = {
      status: newStatus,
      updatedAt: Timestamp.now()
    };
    
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    await updateDoc(docRef, updateData);
    
    // Obtener el documento actualizado
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data();
    
    return {
      id: updatedDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString()
    };
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return null;
  }
};

// Actualizar cita completa
export const updateAppointment = async (id, updates) => {
  try {
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data();
    
    return {
      id: updatedDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString()
    };
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    return null;
  }
};

// Eliminar cita
export const deleteAppointment = async (id) => {
  try {
    await deleteDoc(doc(db, APPOINTMENTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    return false;
  }
};

// Obtener citas por fecha
export const getAppointmentsByDate = async (date) => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('date', '==', date)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      };
    });
  } catch (error) {
    console.error('Error al obtener citas por fecha:', error);
    return [];
  }
};

// Obtener citas por rango de fechas
export const getAppointmentsByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      };
    });
  } catch (error) {
    console.error('Error al obtener citas por rango:', error);
    return [];
  }
};

// Verificar disponibilidad de horario
export const isTimeSlotAvailable = async (date, time, duration, excludeId = null) => {
  try {
    const appointments = await getAppointmentsByDate(date);
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
      const aptEnd = aptStart + apt.serviceDuration;

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
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    return false;
  }
};

// Obtener estadísticas
export const getAppointmentStats = async () => {
  try {
    const appointments = await getAllAppointments();
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
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
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
};

// Limpiar citas antiguas (opcional)
export const cleanOldAppointments = async (daysOld = 90) => {
  try {
    const appointments = await getAllAppointments();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffString = cutoffDate.toISOString().split('T')[0];

    let deletedCount = 0;

    for (const apt of appointments) {
      if (apt.date < cutoffString && apt.status !== appointmentStatuses.PENDING) {
        await deleteAppointment(apt.id);
        deletedCount++;
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('Error al limpiar citas antiguas:', error);
    return 0;
  }
};

// Función auxiliar para convertir Timestamp a string (útil para debugging)
export const timestampToString = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};