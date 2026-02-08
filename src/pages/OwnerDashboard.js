// src/pages/OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../hooks/useAppointments';
import { businessInfo, statusLabels, statusColors, appointmentStatuses } from '../services/servicesData';
import { formatDate } from '../utils/timeSlots';
import '../styles/OwnerDashboard.css';

const OwnerDashboard = () => {
  const { isAuthenticated } = useAuth();
  const {
    appointments,
    loading,
    loadAppointments,
    changeStatus,
    removeAppointment
  } = useAppointments(true); // Auto-refresh activado

  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated, loadAppointments]);

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" />;
  }

  const today = new Date().toISOString().split('T')[0];

  // Filtrar citas
  const filteredAppointments = appointments.filter(apt => {
    // Filtro por estado
    if (filter !== 'all' && apt.status !== filter) return false;
    
    // Filtro por fecha
    if (dateFilter === 'today' && apt.date !== today) return false;
    if (dateFilter === 'upcoming' && apt.date <= today) return false;
    if (dateFilter === 'past' && apt.date >= today) return false;
    
    return true;
  }).sort((a, b) => {
    // Ordenar por fecha y hora
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB - dateA;
  });

  // Estadísticas
  const stats = {
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === appointmentStatuses.PENDING).length,
    confirmed: appointments.filter(apt => apt.status === appointmentStatuses.CONFIRMED).length,
    today: appointments.filter(apt => apt.date === today).length,
    rejected: appointments.filter(apt => apt.status === appointmentStatuses.REJECTED).length,
    completed: appointments.filter(apt => apt.status === appointmentStatuses.COMPLETED).length
  };

  const handleAccept = (appointment) => {
    if (window.confirm(`¿Confirmar la cita de ${appointment.clientName}?`)) {
      changeStatus(appointment.id, appointmentStatuses.CONFIRMED);
      
      // Opcional: Abrir WhatsApp para notificar
      const message = `✅ *Cita Confirmada*\n\n` +
        `Hola ${appointment.clientName},\n\n` +
        `Tu cita ha sido confirmada:\n` +
        `📅 Fecha: ${formatDate(appointment.date)}\n` +
        `⏰ Hora: ${appointment.time}\n` +
        `✂️ Servicio: ${appointment.service}\n\n` +
        `¡Te esperamos!`;
      
      const whatsappUrl = `https://wa.me/52${appointment.clientPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleReject = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      alert('Por favor ingresa un motivo de rechazo');
      return;
    }

    changeStatus(selectedAppointment.id, appointmentStatuses.REJECTED, rejectionReason);
    
    // Opcional: Notificar por WhatsApp
    const message = `❌ *Cita No Confirmada*\n\n` +
      `Hola ${selectedAppointment.clientName},\n\n` +
      `Lamentamos informarte que no pudimos confirmar tu cita.\n` +
      `Motivo: ${rejectionReason}\n\n` +
      `Por favor contáctanos para reagendar.`;
    
    const whatsappUrl = `https://wa.me/52${selectedAppointment.clientPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    setShowRejectModal(false);
    setSelectedAppointment(null);
    setRejectionReason('');
  };

  const handleComplete = (appointment) => {
    if (window.confirm(`¿Marcar como completada la cita de ${appointment.clientName}?`)) {
      changeStatus(appointment.id, appointmentStatuses.COMPLETED);
    }
  };

  const handleDelete = (appointment) => {
    if (window.confirm(`¿Eliminar permanentemente la cita de ${appointment.clientName}?\n\nEsta acción no se puede deshacer.`)) {
      removeAppointment(appointment.id);
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

  if (loading && appointments.length === 0) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Panel de Control</h1>
          <p className="dashboard-subtitle">Gestiona todas las citas de {businessInfo.name}</p>
        </div>
        <button onClick={loadAppointments} className="btn btn-outline btn-sm">
          🔄 Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Total Citas</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">🟠</div>
          <div className="stat-content">
            <span className="stat-label">Pendientes</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>

        <div className="stat-card confirmed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Confirmadas</span>
            <span className="stat-value">{stats.confirmed}</span>
          </div>
        </div>

        <div className="stat-card today">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-label">Hoy</span>
            <span className="stat-value">{stats.today}</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Estado:</label>
          <select 
            className="form-control filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="rejected">Rechazadas</option>
            <option value="completed">Completadas</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Fecha:</label>
          <select 
            className="form-control filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="today">Hoy</option>
            <option value="upcoming">Próximas</option>
            <option value="past">Pasadas</option>
          </select>
        </div>

        <div className="filter-results">
          Mostrando {filteredAppointments.length} de {appointments.length} citas
        </div>
      </div>

      {/* Lista de Citas */}
      <div className="appointments-section">
        {filteredAppointments.length > 0 ? (
          <div className="appointments-grid">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className={`appointment-card status-${apt.status}`}>
                <div className="appointment-header">
                  <div className="appointment-client">
                    <h3>{apt.clientName}</h3>
                    <span className="appointment-id">#{apt.id.slice(-8)}</span>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: statusColors[apt.status] }}
                  >
                    {getStatusIcon(apt.status)} {statusLabels[apt.status]}
                  </span>
                </div>

                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="detail-icon">✂️</span>
                    <span className="detail-text">{apt.service}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{formatDate(apt.date)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">⏰</span>
                    <span className="detail-text">{apt.time} ({apt.serviceDuration} min)</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">📧</span>
                    <span className="detail-text">{apt.clientEmail}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-icon">📱</span>
                    <span className="detail-text">{apt.clientPhone}</span>
                  </div>

                  {apt.notes && (
                    <div className="detail-row notes">
                      <span className="detail-icon">📝</span>
                      <span className="detail-text">{apt.notes}</span>
                    </div>
                  )}

                  {apt.rejectionReason && (
                    <div className="rejection-info">
                      <strong>Motivo de rechazo:</strong>
                      <p>{apt.rejectionReason}</p>
                    </div>
                  )}
                </div>

                <div className="appointment-actions">
                  {apt.status === appointmentStatuses.PENDING && (
                    <>
                      <button 
                        onClick={() => handleAccept(apt)}
                        className="btn btn-sm btn-primary"
                        title="Aceptar cita"
                      >
                        ✅ Aceptar
                      </button>
                      <button 
                        onClick={() => handleReject(apt)}
                        className="btn btn-sm btn-danger"
                        title="Rechazar cita"
                      >
                        ❌ Rechazar
                      </button>
                    </>
                  )}

                  {apt.status === appointmentStatuses.CONFIRMED && (
                    <button 
                      onClick={() => handleComplete(apt)}
                      className="btn btn-sm btn-primary"
                      title="Marcar como completada"
                    >
                      ✔️ Completar
                    </button>
                  )}

                  <a
                    href={`https://wa.me/52${apt.clientPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ backgroundColor: '#25D366', color: 'white' }}
                    title="Contactar por WhatsApp"
                  >
                    💬 WhatsApp
                  </a>

                  <button 
                    onClick={() => handleDelete(apt)}
                    className="btn btn-sm btn-outline"
                    title="Eliminar cita"
                  >
                    🗑️
                  </button>
                </div>

                <div className="appointment-footer">
                  <span className="footer-text">
                    Creada: {new Date(apt.createdAt).toLocaleString('es-MX')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay citas {filter !== 'all' ? `con estado: ${statusLabels[filter]}` : ''}</h3>
            <p>Las nuevas citas aparecerán aquí automáticamente</p>
          </div>
        )}
      </div>

      {/* Modal de Rechazo */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rechazar Cita</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRejectModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p>Cliente: <strong>{selectedAppointment?.clientName}</strong></p>
              <p>Servicio: <strong>{selectedAppointment?.service}</strong></p>
              <p>Fecha: <strong>{selectedAppointment?.date} {selectedAppointment?.time}</strong></p>

              <div className="form-group mt-3">
                <label>Motivo del rechazo *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ejemplo: El horario ya está ocupado, necesito reprogramar, etc."
                  required
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowRejectModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmReject}
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
