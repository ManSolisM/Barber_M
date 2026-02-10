// src/services/servicesData.js
export const services = [
  {
    id: 1,
    name: 'Corte de Cabello',
    price: 200,
    duration: 30,
    description: 'Corte clásico o moderno según tu estilo',
    icon: '✂️',
    available: true
  },
  {
    id: 2,
    name: 'Corte + Barba',
    price: 300,
    duration: 45,
    description: 'Corte de cabello más arreglo de barba',
    icon: '💈',
    available: true
  },
  {
    id: 3,
    name: 'Barba',
    price: 150,
    duration: 20,
    description: 'Arreglo y diseño de barba',
    icon: '🧔',
    available: true
  },
  {
    id: 4,
    name: 'Afeitado Clásico',
    price: 180,
    duration: 25,
    description: 'Afeitado tradicional con navaja',
    icon: '🪒',
    available: true
  },
  {
    id: 5,
    name: 'Tinte',
    price: 400,
    duration: 60,
    description: 'Aplicación de tinte en cabello o barba',
    icon: '🎨',
    available: true
  },
  {
    id: 6,
    name: 'Corte Infantil',
    price: 150,
    duration: 25,
    description: 'Corte para niñas y niños',
    icon: '🧒',
    available: true
  },

  // 🔥 Servicios inclusivos / para todo mundo
  {
    id: 7,
    name: 'Corte Personalizado',
    price: 250,
    duration: 40,
    description: 'Corte adaptado a tu estilo, identidad y preferencia',
    icon: '✨',
    available: true
  },
  {
    id: 8,
    name: 'Lavado + Peinado',
    price: 120,
    duration: 20,
    description: 'Lavado profesional y peinado básico',
    icon: '🧴',
    available: true
  },
  {
    id: 9,
    name: 'Peinado Especial',
    price: 200,
    duration: 30,
    description: 'Peinado para eventos o estilo diario',
    icon: '💇',
    available: true
  },
  {
    id: 10,
    name: 'Diseño de Ceja',
    price: 100,
    duration: 15,
    description: 'Perfilado y limpieza de cejas',
    icon: '👁️',
    available: true
  },
  {
    id: 11,
    name: 'Tratamiento Capilar',
    price: 300,
    duration: 45,
    description: 'Hidratación y cuidado del cabello',
    icon: '💆',
    available: true
  },
  {
    id: 12,
    name: 'Servicio Express',
    price: 100,
    duration: 15,
    description: 'Retoque rápido de cabello o barba',
    icon: '⚡',
    available: true
  }
];


export const businessInfo = {
  name: 'Barber_MX',
  phone: '5529181866', // Cambia este número (sin +52, sin espacios)
  whatsappMessage: 'Hola! Me gustaría agendar una cita.',
  address: 'Calle Principal #123, Centro',
  email: 'contacto@barberMx.com',
  schedule: {
    weekdays: 'Lunes a Viernes: 10:00 AM - 8:00 PM',
    saturday: 'Sábado: 10:00 AM - 6:00 PM',
    sunday: 'Domingo: Cerrado'
  },
  workingHours: {
    monday: { start: '10:00', end: '20:00', closed: false },
    tuesday: { start: '10:00', end: '20:00', closed: false },
    wednesday: { start: '10:00', end: '20:00', closed: false },
    thursday: { start: '10:00', end: '20:00', closed: false },
    friday: { start: '10:00', end: '20:00', closed: false },
    saturday: { start: '10:00', end: '18:00', closed: false },
    sunday: { start: '00:00', end: '00:00', closed: true }
  },
  slotDuration: 15, // Duración de cada slot en minutos
  breakTime: { start: '14:00', end: '15:00' } // Hora de comida
};

// Estados posibles de una cita
export const appointmentStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  rejected: 'Rechazada',
  completed: 'Completada',
  cancelled: 'Cancelada'
};

export const statusColors = {
  pending: '#FF6B4A', // Coral - Requiere atención
  confirmed: '#2D9B9B', // Turquesa - Confirmada
  rejected: '#E85D3F', // Naranja fuego - Rechazada
  completed: '#3B7D7D', // Verde circuito - Completada
  cancelled: '#4A5568' // Gris - Cancelada
};
