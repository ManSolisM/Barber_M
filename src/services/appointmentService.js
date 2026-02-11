// src/services/appointmentService.js
// VERSIÓN MEJORADA: Con eliminación real y completar cita con precio

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
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { appointmentStatuses } from './servicesData';

const APPOINTMENTS_COLLECTION = 'appointments';
const ADMIN_TOKEN = "SECRET_ADMIN_TOKEN_12345"; // Cambia esto

export const generateAppointmentId = () => {
  return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Obtener todas las citas (excluir eliminadas)
export const getAllAppointments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, APPOINTMENTS_COLLECTION));
    const appointments = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        const { adminToken, ...cleanData } = data;
        return {
          id: doc.id,
          ...cleanData,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
        };
      })
      .filter(apt => !apt.deleted); // Filtrar eliminadas
    
    return appointments;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return [];
  }
};

// Crear nueva cita
export const createAppointment = async (appointmentData) => {
  try {
    // Buscar el precio del servicio
    const { services } = await import('./servicesData');
    const service = services.find(s => s.name === appointmentData.service);
    const servicePrice = service ? service.price : 0;

    const newAppointment = {
      appointmentId: generateAppointmentId(),
      ...appointmentData,
      servicePrice: servicePrice, // Guardar precio del servicio
      status: appointmentStatuses.PENDING,
      deleted: false,
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
      if (data.deleted) return null; // No devolver si está eliminada
      
      const { adminToken, ...cleanData } = data;
      return {
        id: docSnap.id,
        ...cleanData,
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

// Obtener citas de un cliente
export const getClientAppointments = async (identifier) => {
  try {
    const qEmail = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('clientEmail', '==', identifier)
    );
    
    const qPhone = query(
      collection(db, APPOINTMENTS_COLLECTION),
      where('clientPhone', '==', identifier)
    );
    
    const [emailResults, phoneResults] = await Promise.all([
      getDocs(qEmail),
      getDocs(qPhone)
    ]);
    
    const appointmentsMap = new Map();
    
    [emailResults, phoneResults].forEach(results => {
      results.docs.forEach(doc => {
        const data = doc.data();
        if (data.deleted) return; // Saltar eliminadas
        
        const { adminToken, ...cleanData } = data;
        appointmentsMap.set(doc.id, {
          id: doc.id,
          ...cleanData,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString()
        });
      });
    });
    
    return Array.from(appointmentsMap.values());
  } catch (error) {
    console.error('Error al obtener citas del cliente:', error);
    return [];
  }
};

// Actualizar estado de cita (SOLO ADMIN)
export const updateAppointmentStatus = async (id, newStatus, rejectionReason = '', isAdmin = false) => {
  try {
    if (!isAdmin) {
      throw new Error('No tienes permisos para actualizar citas');
    }

    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const updateData = {
      status: newStatus,
      updatedAt: Timestamp.now(),
      adminToken: ADMIN_TOKEN
    };
    
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data();
    const { adminToken, ...cleanData } = data;
    
    return {
      id: updatedDoc.id,
      ...cleanData,
      createdAt: data.createdAt?.toDate?.()?.toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString()
    };
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    throw error;
  }
};

// Completar cita con precio ajustable (SOLO ADMIN)
export const completeAppointment = async (id, completionData, isAdmin = false) => {
  try {
    if (!isAdmin) {
      throw new Error('No tienes permisos para completar citas');
    }

    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const updateData = {
      status: appointmentStatuses.COMPLETED,
      finalPrice: completionData.finalPrice,
      completionNotes: completionData.completionNotes || '',
      paymentMethod: completionData.paymentMethod || 'cash',
      completedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      adminToken: ADMIN_TOKEN
    };
    
    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data();
    const { adminToken, ...cleanData } = data;
    
    return {
      id: updatedDoc.id,
      ...cleanData,
      createdAt: data.createdAt?.toDate?.()?.toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString(),
      completedAt: data.completedAt?.toDate?.()?.toISOString()
    };
  } catch (error) {
    console.error('Error al completar cita:', error);
    throw error;
  }
};

// Actualizar cita completa (SOLO ADMIN)
export const updateAppointment = async (id, updates, isAdmin = false) => {
  try {
    if (!isAdmin) {
      throw new Error('No tienes permisos para actualizar citas');
    }

    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
      adminToken: ADMIN_TOKEN
    });
    
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data();
    const { adminToken, ...cleanData } = data;
    
    return {
      id: updatedDoc.id,
      ...cleanData,
      createdAt: data.createdAt?.toDate?.()?.toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString()
    };
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    throw error;
  }
};

// Eliminar cita (SOLO ADMIN) - Marcado lógico
export const deleteAppointment = async (id, isAdmin = false) => {
  try {
    if (!isAdmin) {
      throw new Error('No tienes permisos para eliminar citas');
    }

    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    
    // Opción 1: Marcado lógico (recomendado)
    await updateDoc(docRef, {
      deleted: true,
      deletedAt: Timestamp.now(),
      adminToken: ADMIN_TOKEN
    });
    
    return true;
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    throw error;
  }
};

// Eliminar cita físicamente (SOLO ADMIN) - Usar con precaución
export const deleteAppointmentPermanently = async (id, isAdmin = false) => {
  try {
    if (!isAdmin) {
      throw new Error('No tienes permisos para eliminar citas');
    }

    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error('Error al eliminar cita permanentemente:', error);
    throw error;
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
    return querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        const { adminToken, ...cleanData } = data;
        return {
          id: doc.id,
          ...cleanData,
          createdAt: data.createdAt?.toDate?.()?.toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString()
        };
      })
      .filter(apt => !apt.deleted);
  } catch (error) {
    console.error('Error al obtener citas por fecha:', error);
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
      !apt.deleted &&
      apt.id !== excludeId
    );

    const [hours, minutes] = time.split(':').map(Number);
    const requestedStart = hours * 60 + minutes;
    const requestedEnd = requestedStart + duration;

    for (const apt of activeAppointments) {
      const [aptHours, aptMinutes] = apt.time.split(':').map(Number);
      const aptStart = aptHours * 60 + aptMinutes;
      const aptEnd = aptStart + apt.serviceDuration;

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

// Obtener reporte de ingresos
export const getIncomeReport = async (startDate, endDate) => {
  try {
    const appointments = await getAllAppointments();
    const completedAppointments = appointments.filter(apt => 
      apt.status === appointmentStatuses.COMPLETED &&
      apt.date >= startDate &&
      apt.date <= endDate
    );

    const totalIncome = completedAppointments.reduce((sum, apt) => {
      return sum + (apt.finalPrice || apt.servicePrice || 0);
    }, 0);

    const byPaymentMethod = {
      cash: 0,
      card: 0,
      transfer: 0
    };

    completedAppointments.forEach(apt => {
      const method = apt.paymentMethod || 'cash';
      const amount = apt.finalPrice || apt.servicePrice || 0;
      byPaymentMethod[method] = (byPaymentMethod[method] || 0) + amount;
    });

    return {
      totalAppointments: completedAppointments.length,
      totalIncome,
      byPaymentMethod,
      appointments: completedAppointments
    };
  } catch (error) {
    console.error('Error al obtener reporte de ingresos:', error);
    return {
      totalAppointments: 0,
      totalIncome: 0,
      byPaymentMethod: { cash: 0, card: 0, transfer: 0 },
      appointments: []
    };
  }
};