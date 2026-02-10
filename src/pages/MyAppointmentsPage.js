// src/pages/MyAppointmentsPage.js
// VERSIÓN CORREGIDA - Compatible con Firebase async

import React, { useState } from 'react';
import { getClientAppointments } from '../services/appointmentService';
import { statusLabels, statusColors } from '../services/servicesData';
import { formatDate } from '../utils/timeSlots';
import '../styles/MyAppointmentsPage.css';

const MyAppointmentsPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // FUNCIÓN CORREGIDA con async/await
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!identifier.trim()) {
      alert('Por favor ingresa un email o teléfono');
      return;
    }

    setLoading(true);
    setSearched(false);
    
    try {
      console.log('🔍 Buscando citas para:', identifier.trim());
      
      // Ahora usa await porque getClientAppointments es async
      const results = await getClientAppointments(identifier.trim());
      
      console.log('✅ Citas encontradas:', results.length);
      console.log('Datos:', results);
      
      setAppointments(results);
      setSearched(true);
    } catch (error) {
      console.error('❌ Error al buscar citas:', error);
      alert('Error al buscar citas. Revisa la consola (F12) para más detalles.');
      setAppointments([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '🟠';
      case 'confirmed': return '✅';
      case 'rejected': return '❌';
      case 'completed': return '✔️';
      case 'cancelled': return '⭕';
      default: return '📋';
    }
  };

  return (
    <div className="my-appointments-page">
      <div className="container">
        <div className="page-header">
          <h1>Consultar Mis Citas</h1>
          <p className="page-subtitle">
            Ingresa tu email o teléfono para ver todas tus citas
          </p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Ingresa tu email o teléfono"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small"></span> Buscando...
                  </>
                ) : (
                  '🔍 Buscar Citas'
                )}
              </button>
            </div>
            <p className="search-hint">
              Ejemplo: tu@email.com o 5512345678
            </p>
            {loading && (
              <p className="search-status">
                ⏳ Buscando en la base de datos...
              </p>
            )}
          </form>
        </div>

        {searched && !loading && (
          <div className="results-section animate-slide-up">
            {appointments.length > 0 ? (
              <>
                <div className="results-header">
                  <h2>Tus Citas ({appointments.length})</h2>
                  <p>Últimas actualizaciones de tus citas agendadas</p>
                </div>

                <div className="appointments-list">
                  {appointments
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((apt) => (
                      <div key={apt.id} className={`appointment-card status-${apt.status}`}>
                        <div className="appointment-header">
                          <div className="appointment-status">
                            <span 
                              className="status-badge" 
                              style={{ backgroundColor: statusColors[apt.status] }}
                            >
                              {getStatusIcon(apt.status)} {statusLabels[apt.status]}
                            </span>
                          </div>
                          <div className="appointment-id">
                            ID: <code>{apt.appointmentId || apt.id}</code>
                          </div>
                        </div>

                        <div className="appointment-body">
                          <div className="appointment-info">
                            <div className="info-row">
                              <span className="info-icon">✂️</span>
                              <div className="info-content">
                                <strong>{apt.service}</strong>
                                <span className="info-meta"> {apt.serviceDuration} minutos</span>
                              </div>
                            </div>

                            <div className="info-row">
                              <span className="info-icon">📅</span>
                              <div className="info-content">
                                <strong>{formatDate(apt.date)}</strong>
                                <span className="info-meta"> Fecha de cita</span>
                              </div>
                            </div>

                            <div className="info-row">
                              <span className="info-icon">⏰</span>
                              <div className="info-content">
                                <strong>{apt.time}</strong>
                                <span className="info-meta"> Hora agendada</span>
                              </div>
                            </div>

                            <div className="info-row">
                              <span className="info-icon">👤</span>
                              <div className="info-content">
                                <strong>{apt.clientName}</strong>
                                <span className="info-meta"> Nombre del cliente</span>
                              </div>
                            </div>

                            {apt.notes && (
                              <div className="info-row">
                                <span className="info-icon">📝</span>
                                <div className="info-content">
                                  <span className="info-notes"> {apt.notes}</span>
                                </div>
                              </div>
                            )}

                            {apt.status === 'rejected' && apt.rejectionReason && (
                              <div className="rejection-reason">
                                <strong>Motivo de rechazo:</strong>
                                <p>{apt.rejectionReason}</p>
                              </div>
                            )}
                          </div>

                          <div className="appointment-dates">
                            <span className="date-item">
                              Agendada: {new Date(apt.createdAt).toLocaleDateString('es-MX')}
                            </span>
                            {apt.updatedAt !== apt.createdAt && (
                              <span className="date-item">
                                Actualizada: {new Date(apt.updatedAt).toLocaleDateString('es-MX')}
                              </span>
                            )}
                          </div>
                        </div>

                        {apt.status === 'pending' && (
                          <div className="appointment-footer">
                            <div className="alert alert-info">
                              ⏳ Tu cita está pendiente de confirmación. Recibirás notificación pronto.
                            </div>
                          </div>
                        )}

                        {apt.status === 'confirmed' && (
                          <div className="appointment-footer">
                            <div className="alert alert-success">
                              ✅ Tu cita ha sido confirmada. ¡Te esperamos!
                            </div>
                          </div>
                        )}

                        {apt.status === 'rejected' && (
                          <div className="appointment-footer">
                            <div className="alert alert-danger">
                              ❌ Esta cita fue rechazada. Puedes agendar una nueva fecha.
                            </div>
                          </div>
                        )}

                        {apt.status === 'completed' && (
                          <div className="appointment-footer">
                            <div className="alert alert-success">
                              ✔️ Servicio completado. ¡Gracias por tu preferencia!
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="empty-results">
                <div className="empty-icon">🔍</div>
                <h3>No se encontraron citas</h3>
                <p>No hay citas registradas con: <strong>{identifier}</strong></p>
                <div className="empty-hints">
                  <p className="empty-hint">
                    ✓ Verifica que hayas ingresado correctamente el email o teléfono
                  </p>
                  <p className="empty-hint">
                    ✓ Debe ser exactamente como lo escribiste al agendar
                  </p>
                  <p className="empty-hint">
                    ✓ Los emails son sensibles a mayúsculas/minúsculas
                  </p>
                </div>
                <a href="/book" className="btn btn-primary mt-3">
                  📅 Agendar Nueva Cita
                </a>
              </div>
            )}
          </div>
        )}

        {!searched && !loading && (
          <div className="info-section">
            <div className="info-cards">
              <div className="info-card">
                <div className="info-card-icon">🔍</div>
                <h3>Busca tus Citas</h3>
                <p>Ingresa el email o teléfono que usaste al agendar para ver todas tus citas.</p>
              </div>

              <div className="info-card">
                <div className="info-card-icon">📊</div>
                <h3>Revisa el Estado</h3>
                <p>Verás si tu cita está pendiente, confirmada o rechazada en tiempo real.</p>
              </div>

              <div className="info-card">
                <div className="info-card-icon">🔐</div>
                <h3>Código Único</h3>
                <p>Cada cita tiene un código de seguimiento único para mayor seguridad.</p>
              </div>
            </div>

            <div className="status-legend">
              <h3>Estados de Cita</h3>
              <div className="legend-grid">
                <div className="legend-item">
                  <span className="legend-badge" style={{ backgroundColor: statusColors.pending }}>
                    🟠 Pendiente
                  </span>
                  <span>Esperando confirmación del dueño</span>
                </div>
                <div className="legend-item">
                  <span className="legend-badge" style={{ backgroundColor: statusColors.confirmed }}>
                    ✅ Confirmada
                  </span>
                  <span>Cita aceptada, te esperamos</span>
                </div>
                <div className="legend-item">
                  <span className="legend-badge" style={{ backgroundColor: statusColors.rejected }}>
                    ❌ Rechazada
                  </span>
                  <span>No se pudo confirmar</span>
                </div>
                <div className="legend-item">
                  <span className="legend-badge" style={{ backgroundColor: statusColors.completed }}>
                    ✔️ Completada
                  </span>
                  <span>Servicio realizado</span>
                </div>
              </div>
            </div>

            <div className="search-tips">
              <h4>💡 Consejos de Búsqueda:</h4>
              <ul>
                <li>El email debe estar escrito exactamente como al agendar</li>
                <li>El teléfono debe tener 10 dígitos (sin espacios ni guiones)</li>
                <li>Si no recuerdas qué dato usaste, intenta con ambos</li>
                <li>Revisa tu correo spam por confirmaciones</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
