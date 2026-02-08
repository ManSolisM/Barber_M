# 💈 Barbería Elegante PRO - Sistema Avanzado de Citas

Sistema completo de gestión de citas para barberías con interfaz moderna y funcionalidades avanzadas.

## 🌟 Características Principales

### Para Clientes:
- ✅ Catálogo interactivo de servicios
- ✅ Sistema de agendamiento con calendario visual
- ✅ Consulta de citas con código de seguimiento
- ✅ Estados de cita en tiempo real (Pendiente/Confirmada/Rechazada)
- ✅ Integración directa con WhatsApp
- ✅ Verificación de disponibilidad en tiempo real
- ✅ Interfaz responsive y moderna

### Para Dueño:
- ✅ Panel de administración completo
- ✅ Aceptar/Rechazar citas con motivos
- ✅ Calendario visual de citas
- ✅ Estadísticas y métricas
- ✅ Gestión completa de agenda
- ✅ Contacto directo por WhatsApp
- ✅ Filtros avanzados

## 🎨 Paleta de Colores JAMELZ

- **Turquesa Tecnológico**: `#2D9B9B` - Color primario
- **Coral Energético**: `#FF6B4A` - Acciones y CTAs
- **Azul Profundo**: `#1A2332` - Fondos oscuros
- **Beige Cálido**: `#F4D6A8` - Fondos alternativos
- **Verde Circuito**: `#3B7D7D` - Elementos secundarios
- **Naranja Fuego**: `#E85D3F` - Alertas

## 📁 Estructura del Proyecto

\`\`\`
barbershop-pro/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Header.js
│   │       ├── Footer.js
│   │       └── ServiceCard.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   └── useAppointments.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── BookingPage.js
│   │   ├── MyAppointmentsPage.js
│   │   ├── LoginPage.js
│   │   └── OwnerDashboard.js
│   ├── services/
│   │   ├── servicesData.js
│   │   └── appointmentService.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── Header.css
│   │   ├── Footer.css
│   │   ├── ServiceCard.css
│   │   └── HomePage.css
│   ├── utils/
│   │   └── timeSlots.js
│   ├── App.js
│   └── index.js
└── package.json
\`\`\`

## 🚀 Instalación

1. **Clonar/Descargar el proyecto**
\`\`\`bash
cd barbershop-pro
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Ejecutar en desarrollo**
\`\`\`bash
npm start
\`\`\`

## ⚙️ Configuración

### 1. Información del Negocio
Edita `src/services/servicesData.js`:

\`\`\`javascript
export const businessInfo = {
  name: 'Tu Barbería',
  phone: '5512345678',  // Sin +52
  email: 'contacto@tubarberia.com',
  address: 'Tu dirección completa',
  // ... horarios
};
\`\`\`

### 2. Servicios
Modifica el array `services` en el mismo archivo.

### 3. Credenciales de Acceso
Edita `src/context/AuthContext.js`:

\`\`\`javascript
const ownerCredentials = {
  username: 'admin',
  password: 'TuContraseñaSegura'
};
\`\`\`

### 4. GitHub Pages
En `package.json`, línea 4:

\`\`\`json
"homepage": "https://tuusuario.github.io/barbershop-pro"
\`\`\`

## 🌐 Deployment

\`\`\`bash
npm run deploy
\`\`\`

Luego activa GitHub Pages en:
- Settings → Pages
- Source: `gh-pages` branch

## 📱 Funcionalidades Detalladas

### Sistema de Citas
- Validación de horarios disponibles
- Prevención de conflictos
- Estados: Pendiente → Confirmada/Rechazada
- Código de seguimiento único

### Calendario Inteligente
- Solo muestra días disponibles
- Excluye días cerrados
- Marca slots ocupados
- Horarios de comida respetados

### Panel de Administración
- Vista de citas por fecha
- Filtros múltiples
- Estadísticas en vivo
- Acciones rápidas

## 🔧 Tecnologías

- React 18
- React Router DOM 6
- React Calendar 4
- date-fns
- CSS3 moderno
- LocalStorage API

## 📊 Datos y Almacenamiento

- Citas guardadas en LocalStorage
- Persistencia entre sesiones
- Sistema de IDs únicos
- Función de limpieza de datos antiguos

## 🎯 Próximas Mejoras Sugeridas

1. Backend con Node.js + Express
2. Base de datos MongoDB/PostgreSQL
3. Autenticación JWT
4. Notificaciones push
5. Sistema de recordatorios
6. Integración con calendario de Google
7. Pasarela de pagos
8. App móvil nativa

## 👨‍💻 Creado por JAMELZ

Desarrollado con ❤️ por [JAMELZ](https://jamelz.dev) 🐫✨

## 📄 Licencia

MIT License - Libre para uso comercial y personal

---

Para soporte o consultas, contacta a través del repositorio de GitHub.
