# 🚀 GUÍA DE INICIO RÁPIDO - Barbería PRO

## 📦 Descarga e Instalación

### Paso 1: Requisitos Previos
- Node.js (versión 14 o superior) - Descarga de https://nodejs.org/
- Editor de código (VS Code recomendado)
- Cuenta de GitHub (para publicar)

### Paso 2: Preparar el Proyecto
1. Descarga el archivo ZIP del proyecto
2. Extrae los archivos en una carpeta
3. Abre la carpeta en tu editor de código

### Paso 3: Personalizar Información

#### A) Datos del Negocio
Archivo: `src/services/servicesData.js`

```javascript
export const businessInfo = {
  name: 'TU BARBERÍA AQUÍ',
  phone: '5512345678',  // TU NÚMERO sin +52
  email: 'contacto@tubarberia.com',
  address: 'Tu dirección completa',
  schedule: {
    weekdays: 'Lunes a Viernes: 10:00 AM - 8:00 PM',
    saturday: 'Sábado: 10:00 AM - 6:00 PM',
    sunday: 'Domingo: Cerrado'
  },
  workingHours: {
    // Personaliza tus horarios aquí
    monday: { start: '10:00', end: '20:00', closed: false },
    // ... resto de días
  }
};
```

#### B) Credenciales de Acceso
Archivo: `src/context/AuthContext.js`

```javascript
const ownerCredentials = {
  username: 'tu_usuario',  // CAMBIA ESTO
  password: 'tu_contraseña_segura'  // CAMBIA ESTO
};
```

⚠️ **MUY IMPORTANTE**: Cambia estos valores por seguridad!

#### C) Configuración de GitHub
Archivo: `package.json` (línea 4)

```json
"homepage": "https://TUUSUARIO.github.io/barbershop-pro"
```

Reemplaza `TUUSUARIO` con tu nombre de usuario de GitHub.

### Paso 4: Instalar y Probar

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
# Instalar dependencias (primera vez)
npm install

# Iniciar servidor de desarrollo
npm start
```

El navegador se abrirá automáticamente en `http://localhost:3000`

### Paso 5: Publicar en GitHub Pages

#### 5.1 Crear Repositorio en GitHub
1. Ve a https://github.com
2. Click en "New repository"
3. Nombre: `barbershop-pro`
4. Click "Create repository"

#### 5.2 Subir tu Código
En la terminal del proyecto:

```bash
git init
git add .
git commit -m "Primera versión - Sistema de citas"
git branch -M main
git remote add origin https://github.com/TUUSUARIO/barbershop-pro.git
git push -u origin main
```

(Reemplaza `TUUSUARIO` con tu usuario de GitHub)

#### 5.3 Publicar el Sitio
```bash
npm run deploy
```

Este comando:
- Construye tu aplicación optimizada
- La sube a rama `gh-pages`
- GitHub la publica automáticamente

#### 5.4 Activar GitHub Pages
1. En tu repositorio de GitHub
2. Settings → Pages
3. Source: Branch `gh-pages`, carpeta `/ (root)`
4. Save

⏰ **Espera 2-5 minutos** para que se active.

Tu sitio estará en: `https://TUUSUARIO.github.io/barbershop-pro`

## 🎯 ¿Cómo Funciona el Sistema?

### Para Clientes:

1. **Agendar Cita:**
   - Entran a tu sitio
   - Click en "Agendar"
   - Seleccionan servicio
   - Eligen fecha y hora disponible
   - Llenan sus datos
   - Confirman → Se envía WhatsApp automáticamente

2. **Consultar Citas:**
   - Click en "Mis Citas"
   - Ingresan email o teléfono
   - Ven todas sus citas con estados:
     - 🟠 Pendiente (esperando confirmación)
     - ✅ Confirmada
     - ❌ Rechazada
     - ✔️ Completada

### Para Dueño:

1. **Acceder al Panel:**
   - Click en "Acceso Dueño"
   - Ingresar credenciales
   - Ver Dashboard completo

2. **Gestionar Citas:**
   - Ver todas las citas organizadas
   - Filtrar por fecha, estado
   - **Aceptar** citas pendientes
   - **Rechazar** con motivo
   - Marcar como completadas
   - Contactar por WhatsApp
   - Ver calendario visual

3. **Estadísticas:**
   - Citas totales
   - Pendientes de revisar
   - Confirmadas hoy
   - Métricas generales

## 🔧 Funcionalidades Avanzadas

### Sistema Inteligente de Horarios
- Solo muestra horarios disponibles
- Evita conflictos automáticamente
- Respeta días cerrados
- Considera tiempo de servicio
- Bloquea hora de comida

### Códigos de Seguimiento
- Cada cita tiene ID único
- Cliente puede rastrear estado
- Historial completo guardado

### Notificaciones WhatsApp
- Confirmación automática al agendar
- Dueño recibe notificación
- Puede responder directamente

## 📱 Personalización de Colores

Archivo: `src/styles/App.css`

```css
:root {
  --turquesa-tech: #2D9B9B;
  --coral-energetic: #FF6B4A;
  --azul-profundo: #1A2332;
  --beige-calido: #F4D6A8;
  /* Modifica estos valores */
}
```

## 🔄 Actualizar tu Sitio

Cuando hagas cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
npm run deploy
```

## ❓ Problemas Comunes y Soluciones

### "npm: command not found"
**Solución**: Instala Node.js desde https://nodejs.org/

### "Failed to compile"
**Solución**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### No carga en GitHub Pages
**Solución**:
1. Verifica `homepage` en package.json
2. Asegúrate de haber ejecutado `npm run deploy`
3. Activa Pages en Settings
4. Espera 5 minutos

### WhatsApp no funciona
**Solución**:
1. Verifica número en `servicesData.js`
2. Formato: `5512345678` (sin +52, sin espacios)
3. Prueba en celular (WhatsApp instalado)

### No puedo iniciar sesión
**Solución**:
- Usuario por defecto: `admin`
- Contraseña por defecto: `admin123`
- Si cambiaste: usa tus nuevas credenciales
- Revisa `AuthContext.js`

## 💡 Tips y Recomendaciones

### Seguridad:
- ✅ Cambia las credenciales por defecto
- ✅ Usa contraseñas fuertes
- ✅ No compartas tu usuario/contraseña
- ⚠️ Para producción real, considera un backend

### Mantenimiento:
- Limpia citas antiguas regularmente
- Revisa citas pendientes diariamente
- Actualiza servicios y precios
- Haz backup de datos importantes

### Marketing:
- Comparte el link en redes sociales
- Agrega a bio de Instagram
- Pon código QR en tu local
- Promociona el sistema de citas

## 📞 Soporte

### Recursos:
- 📖 README.md - Documentación técnica completa
- 📂 Código comentado
- 🌐 Documentación de React: https://react.dev/

### Comunidad:
- Busca en Google con palabras clave específicas
- Stack Overflow para problemas técnicos
- GitHub Issues en repositorios similares

## 🎓 Próximos Pasos

Una vez que domines el sistema:

1. **Aprende más de React** para personalizaciones
2. **Agrega más funcionalidades**:
   - Sistema de promociones
   - Programa de lealtad
   - Galería de trabajos
   - Testimonios de clientes
3. **Considera un backend real** para escalar
4. **Explora integraciones**:
   - Google Calendar
   - Pagos en línea
   - Email marketing

## 🌟 Créditos

Sistema desarrollado por **JAMELZ** 🐫✨
- Diseño moderno y profesional
- Paleta de colores optimizada
- Código limpio y documentado
- Arquitectura escalable

---

¡Éxito con tu barbería! 💈✂️

**¿Preguntas?** Revisa el README.md completo para más detalles técnicos.
