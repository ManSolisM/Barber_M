// src/services/servicesData.js
// Catálogo ampliado de servicios para público general

export const services = [
  // CORTES DE CABELLO
  {
    id: 1,
    name: 'Corte de Cabello Caballero',
    price: 200,
    duration: 30,
    description: 'Corte clásico o moderno según tu estilo',
    icon: '✂️',
    category: 'Cabello',
    available: true
  },
  {
    id: 2,
    name: 'Corte de Cabello Dama',
    price: 250,
    duration: 45,
    description: 'Corte, lavado y peinado profesional',
    icon: '💇‍♀️',
    category: 'Cabello',
    available: true
  },
  {
    id: 3,
    name: 'Corte Niño',
    price: 150,
    duration: 25,
    description: 'Corte especial para niños hasta 12 años',
    icon: '👦',
    category: 'Cabello',
    available: true
  },
  {
    id: 4,
    name: 'Corte Fade',
    price: 250,
    duration: 40,
    description: 'Degradado profesional con navaja',
    icon: '🔥',
    category: 'Cabello',
    available: true
  },
  
  // BARBA Y AFEITADO
  {
    id: 5,
    name: 'Arreglo de Barba',
    price: 150,
    duration: 20,
    description: 'Arreglo y diseño de barba profesional',
    icon: '🧔',
    category: 'Barba',
    available: true
  },
  {
    id: 6,
    name: 'Afeitado Clásico',
    price: 180,
    duration: 25,
    description: 'Afeitado tradicional con navaja y toalla caliente',
    icon: '🪒',
    category: 'Barba',
    available: true
  },
  {
    id: 7,
    name: 'Barba + Bigote',
    price: 180,
    duration: 30,
    description: 'Arreglo completo de barba y bigote',
    icon: '👨',
    category: 'Barba',
    available: true
  },
  
  // PAQUETES
  {
    id: 8,
    name: 'Corte + Barba',
    price: 300,
    duration: 45,
    description: 'Paquete completo: corte de cabello y arreglo de barba',
    icon: '💈',
    category: 'Paquetes',
    available: true
  },
  {
    id: 9,
    name: 'Paquete Premium',
    price: 450,
    duration: 60,
    description: 'Corte, barba, afeitado de cuello y masaje capilar',
    icon: '⭐',
    category: 'Paquetes',
    available: true
  },
  {
    id: 10,
    name: 'Paquete Express',
    price: 250,
    duration: 30,
    description: 'Corte rápido y barba básica',
    icon: '⚡',
    category: 'Paquetes',
    available: true
  },
  
  // TINTES Y COLOR
  {
    id: 11,
    name: 'Tinte de Cabello',
    price: 400,
    duration: 60,
    description: 'Tinte completo de cabello, cualquier tono',
    icon: '🎨',
    category: 'Color',
    available: true
  },
  {
    id: 12,
    name: 'Tinte de Barba',
    price: 250,
    duration: 30,
    description: 'Tinte profesional de barba',
    icon: '🖌️',
    category: 'Color',
    available: true
  },
  {
    id: 13,
    name: 'Mechas/Highlights',
    price: 600,
    duration: 90,
    description: 'Mechas o luces californianas',
    icon: '✨',
    category: 'Color',
    available: true
  },
  {
    id: 14,
    name: 'Retoque de Raíz',
    price: 300,
    duration: 45,
    description: 'Retoque de color en raíces',
    icon: '🎯',
    category: 'Color',
    available: true
  },
  
  // TRATAMIENTOS
  {
    id: 15,
    name: 'Tratamiento Capilar',
    price: 350,
    duration: 45,
    description: 'Tratamiento hidratante y revitalizante',
    icon: '💆',
    category: 'Tratamientos',
    available: true
  },
  {
    id: 16,
    name: 'Keratina',
    price: 800,
    duration: 120,
    description: 'Tratamiento de keratina alisadora',
    icon: '🌟',
    category: 'Tratamientos',
    available: true
  },
  {
    id: 17,
    name: 'Permanente',
    price: 500,
    duration: 90,
    description: 'Permanente o rizado profesional',
    icon: '🌀',
    category: 'Tratamientos',
    available: true
  },
  
  // ADICIONALES
  {
    id: 18,
    name: 'Lavado y Peinado',
    price: 100,
    duration: 20,
    description: 'Lavado y peinado profesional',
    icon: '🚿',
    category: 'Adicionales',
    available: true
  },
  {
    id: 19,
    name: 'Planchado',
    price: 150,
    duration: 30,
    description: 'Planchado profesional de cabello',
    icon: '📏',
    category: 'Adicionales',
    available: true
  },
  {
    id: 20,
    name: 'Peinado de Evento',
    price: 300,
    duration: 45,
    description: 'Peinado especial para eventos o celebraciones',
    icon: '👑',
    category: 'Adicionales',
    available: true
  },
  {
    id: 21,
    name: 'Diseño en Cabello',
    price: 200,
    duration: 30,
    description: 'Diseños o líneas artísticas con navaja',
    icon: '🎭',
    category: 'Adicionales',
    available: true
  },
  {
    id: 22,
    name: 'Limpieza Facial',
    price: 200,
    duration: 30,
    description: 'Limpieza facial profunda y mascarilla',
    icon: '🧖',
    category: 'Adicionales',
    available: true
  },
  {
    id: 23,
    name: 'Depilación de Cejas',
    price: 80,
    duration: 15,
    description: 'Perfilado y depilación de cejas',
    icon: '👁️',
    category: 'Adicionales',
    available: true
  },
  {
    id: 24,
    name: 'Masaje Capilar',
    price: 150,
    duration: 20,
    description: 'Masaje relajante de cuero cabelludo',
    icon: '💆‍♂️',
    category: 'Adicionales',
    available: true
  }
];

// Obtener servicios por categoría
export const getServicesByCategory = () => {
  const categories = {};
  services.forEach(service => {
    if (!categories[service.category]) {
      categories[service.category] = [];
    }
    categories[service.category].push(service);
  });
  return categories;
};

// Información del negocio
export const businessInfo = {
  name: 'Barber by Jamelz',
  phone: '5529181866',
  whatsappMessage: 'Hola! Me gustaría agendar una cita.',
  address: 'Calle Principal #123, Centro',
  email: 'contacto@barberbyjamelz.com',
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
  slotDuration: 30,
  breakTime: { start: '14:00', end: '15:00' }
};

// Estados de citas
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
  pending: '#FF6B4A',
  confirmed: '#2D9B9B',
  rejected: '#E85D3F',
  completed: '#3B7D7D',
  cancelled: '#4A5568'
};
