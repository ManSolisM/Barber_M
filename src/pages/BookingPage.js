// src/pages/BookingPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, businessInfo } from '../services/servicesData';
import { createAppointment } from '../services/appointmentService';
import { generateAvailableSlots, getNextAvailableDays, formatDate } from '../utils/timeSlots';
import ServiceCard from '../components/common/ServiceCard';
import '../styles/BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: null,
    date: '',
    time: '',
    notes: ''
  });
  const [availableDays, setAvailableDays] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar días disponibles al iniciar
  useEffect(() => {
    const days = getNextAvailableDays(14);
    setAvailableDays(days);
  }, []);

  // Cuando se selecciona una fecha, cargar horarios
  useEffect(() => {
    if (formData.date && formData.service) {
      const slots = generateAvailableSlots(formData.date, formData.service.duration);
      setAvailableSlots(slots);
    }
  }, [formData.date, formData.service]);

  const handleServiceSelect = (service) => {
    setFormData({ ...formData, service });
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setFormData({ ...formData, date, time: '' });
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, time });
    setStep(3);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const appointmentData = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      service: formData.service.name,
      serviceDuration: formData.service.duration,
      date: formData.date,
      time: formData.time,
      notes: formData.notes
    };

    try {
      const appointment = createAppointment(appointmentData);

      // Mensaje de WhatsApp
      const message = `🎯 *Nueva Cita Agendada*\n\n` +
        `👤 Cliente: ${formData.clientName}\n` +
        `📧 Email: ${formData.clientEmail}\n` +
        `📱 Teléfono: ${formData.clientPhone}\n` +
        `✂️ Servicio: ${formData.service.name}\n` +
        `📅 Fecha: ${formatDate(formData.date)}\n` +
        `⏰ Hora: ${formData.time}\n` +
        `🆔 Código: ${appointment.id}\n` +
        `${formData.notes ? `📝 Notas: ${formData.notes}\n` : ''}` +
        `\n⏳ Estado: Pendiente de confirmación`;

      const whatsappUrl = `https://wa.me/52${businessInfo.phone}?text=${encodeURIComponent(message)}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Mostrar confirmación
      alert(`✅ ¡Cita agendada exitosamente!\n\nCódigo de seguimiento: ${appointment.id}\n\nSe ha enviado la información por WhatsApp.\nRecibirás confirmación pronto.`);

      // Redirigir
      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);

    } catch (error) {
      alert('❌ Error al agendar la cita. Por favor intenta de nuevo.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <h1>Agendar Nueva Cita</h1>
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Servicio</span>
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Fecha/Hora</span>
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Datos</span>
            </div>
          </div>
        </div>

        {/* PASO 1: Seleccionar Servicio */}
        {step === 1 && (
          <div className="step-content animate-slide-up">
            <h2>Selecciona el Servicio</h2>
            <div className="services-grid">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                  selected={formData.service?.id === service.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: Seleccionar Fecha y Hora */}
        {step === 2 && (
          <div className="step-content animate-slide-up">
            <button onClick={goBack} className="btn btn-outline btn-sm mb-3">
              ← Cambiar Servicio
            </button>
            
            <div className="selected-service-badge">
              <span className="service-icon">{formData.service.icon}</span>
              <div>
                <strong>{formData.service.name}</strong>
                <span className="service-meta">${formData.service.price} • {formData.service.duration} min</span>
              </div>
            </div>

            <h2>Selecciona Fecha y Hora</h2>
            
            <div className="datetime-selector">
              <div className="date-section">
                <h3>📅 Fecha</h3>
                <div className="date-grid">
                  {availableDays.map((day, index) => (
                    <button
                      key={index}
                      className={`date-card ${formData.date === day.date ? 'selected' : ''}`}
                      onClick={() => handleDateSelect(day.date)}
                    >
                      <span className="date-day">{new Date(day.date + 'T00:00:00').getDate()}</span>
                      <span className="date-month">{new Date(day.date + 'T00:00:00').toLocaleDateString('es-MX', { month: 'short' })}</span>
                      <span className="date-weekday">{new Date(day.date + 'T00:00:00').toLocaleDateString('es-MX', { weekday: 'short' })}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.date && (
                <div className="time-section animate-slide-up">
                  <h3>⏰ Hora</h3>
                  {availableSlots.length > 0 ? (
                    <div className="time-grid">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          className={`time-card ${formData.time === slot.time ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
                          onClick={() => slot.available && handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                        >
                          {slot.formatted}
                          {!slot.available && <span className="unavailable-badge">Ocupado</span>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-warning">
                      No hay horarios disponibles para esta fecha.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASO 3: Datos del Cliente */}
        {step === 3 && (
          <div className="step-content animate-slide-up">
            <button onClick={goBack} className="btn btn-outline btn-sm mb-3">
              ← Cambiar Fecha/Hora
            </button>

            <div className="appointment-summary">
              <h3>📋 Resumen de tu Cita</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Servicio:</span>
                  <span className="summary-value">{formData.service.icon} {formData.service.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Fecha:</span>
                  <span className="summary-value">{formatDate(formData.date)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Hora:</span>
                  <span className="summary-value">{formData.time}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Precio:</span>
                  <span className="summary-value">${formData.service.price}</span>
                </div>
              </div>
            </div>

            <h2>Tus Datos</h2>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="clientName">Nombre Completo *</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  className="form-control"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                  placeholder="Tu nombre completo"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="clientEmail">Email *</label>
                  <input
                    type="email"
                    id="clientEmail"
                    name="clientEmail"
                    className="form-control"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientPhone">Teléfono *</label>
                  <input
                    type="tel"
                    id="clientPhone"
                    name="clientPhone"
                    className="form-control"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="5512345678"
                    pattern="[0-9]{10}"
                    title="Ingresa 10 dígitos"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notas Adicionales (Opcional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Alguna petición especial o comentario..."
                ></textarea>
              </div>

              <div className="alert alert-info">
                ℹ️ Al confirmar, se enviará tu solicitud por WhatsApp y recibirás un código de seguimiento.
                El dueño confirmará tu cita pronto.
              </div>

              <button 
                type="submit" 
                className="btn btn-secondary btn-lg w-100"
                disabled={loading}
              >
                {loading ? '⏳ Procesando...' : '✅ Confirmar Cita'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
