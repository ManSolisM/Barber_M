// src/services/appointmentService.js
// Versión con autenticación de admin mediante token

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

// TOKEN SECRETO DE ADMIN
// CAMBIA ESTO por tu propio token secreto
// Debe coincidir con el de las reglas de Firebase
const ADMIN_TOKEN = "SECRET_ADMIN_TOKEN_12345"; // CÁMBIALO en producción

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
      // No incluir el adminToken en los datos devueltos
      const { adminToken, ...cleanData } = data;
      return {
        id: doc.id,
        ...cleanData,
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

// Crear nueva cita (cualquiera puede crear)
export const createAppointment = async (appointmentData) => {
  try {
    const newAppointment = {
      appointmentId: generateAppointmentId(),
      ...appointmentData,
      status: appointmentStatuses.PENDING,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
      // NO incluir adminToken al crear
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
    
    emailResults.docs.forEach(doc => {
      const data = doc.data();
      const { adminToken, ...cleanData } = data;
      appointmentsMap.set(doc.id, {
        id: doc.id,
        ...cleanData,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      });
    });
    
    phoneResults.docs.forEach(doc => {
      const data = doc.data();
      const { adminToken, ...cleanData } = data;
      appointmentsMap.set(doc.id, {
        id: doc.id,
        ...cleanData,
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

// Actualizar estado de cita (SOLO ADMIN)
export const updateAppointmentStatus = async (id, newStatus, rejectionReason = '', isAdmin = false) => {
  try {
    // Verificar que quien llama sea admin
    if (!isAdmin) {
      throw new Error('No tienes permisos para actualizar citas');
    }

    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    const updateData = {
      status: newStatus,
      updatedAt: Timestamp.now(),
      adminToken: ADMIN_TOKEN // Incluir token para pasar validación de Firebase
    };
    
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    await updateDoc(docRef, updateData);
    
    // Obtener el documento actualizado
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

// Eliminar cita (SOLO ADMIN)
export const deleteAppointment = async (id, isAdmin = false) => {
  try {
    if (!isAdmin) {
      throw new Error('No tienes permisos para eliminar citas');
    }

    // Para eliminar, primero actualizamos con el token, luego eliminamos
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    
    // Marcar como eliminado primero
    await updateDoc(docRef, {
      adminToken: ADMIN_TOKEN,
      deletedAt: Timestamp.now()
    });
    
    // Luego eliminar (esto puede fallar si las reglas no lo permiten)
    // Por ahora, solo marcamos como eliminado
    await updateDoc(docRef, {
      status: 'deleted',
      adminToken: ADMIN_TOKEN
    });
    
    return true;
  } catch (error) {
    console.error('Error al eliminar cita:', error);
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
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const { adminToken, ...cleanData } = data;
      return {
        id: doc.id,
        ...cleanData,
        createdAt: data.createdAt?.toDate?.()?.toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString()
      };
    }).filter(apt => apt.status !== 'deleted'); // Filtrar eliminados
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
      apt.status !== 'deleted' &&
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
    
    // Filtrar eliminados
    const activeAppointments = appointments.filter(apt => apt.status !== 'deleted');

    return {
      total: activeAppointments.length,
      pending: activeAppointments.filter(apt => apt.status === appointmentStatuses.PENDING).length,
      confirmed: activeAppointments.filter(apt => apt.status === appointmentStatuses.CONFIRMED).length,
      completed: activeAppointments.filter(apt => apt.status === appointmentStatuses.COMPLETED).length,
      rejected: activeAppointments.filter(apt => apt.status === appointmentStatuses.REJECTED).length,
      cancelled: activeAppointments.filter(apt => apt.status === appointmentStatuses.CANCELLED).length,
      today: activeAppointments.filter(apt => apt.date === today).length
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
