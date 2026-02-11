// src/components/owner/CompleteAppointmentModal.js
// Modal para completar cita con precio ajustable

import React, { useState } from 'react';
import '../../styles/CompleteAppointmentModal.css';

const CompleteAppointmentModal = ({ appointment, onConfirm, onCancel }) => {
  const [finalPrice, setFinalPrice] = useState(appointment.servicePrice || 0);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleConfirm = () => {
    const completionData = {
      finalPrice: parseFloat(finalPrice),
      completionNotes: notes,
      paymentMethod: paymentMethod,
      completedAt: new Date().toISOString()
    };
    onConfirm(completionData);
  };

  // Obtener el precio del servicio
  const servicePrice = appointment.servicePrice || appointment.price || 0;
  const discount = servicePrice - finalPrice;
  const discountPercentage = servicePrice > 0 ? ((discount / servicePrice) * 100).toFixed(0) : 0;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content complete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💰 Completar Cita</h3>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body">
          {/* Información de la cita */}
          <div className="appointment-summary">
            <h4>📋 Resumen del Servicio</h4>
            <div className="summary-row">
              <span className="summary-label">Cliente:</span>
              <span className="summary-value">{appointment.clientName}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Servicio:</span>
              <span className="summary-value">{appointment.service}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Fecha:</span>
              <span className="summary-value">{appointment.date} - {appointment.time}</span>
            </div>
            <div className="summary-row highlight">
              <span className="summary-label">Precio del Servicio:</span>
              <span className="summary-value price-original">${servicePrice}</span>
            </div>
          </div>

          {/* Ajustar precio */}
          <div className="price-section">
            <h4>💵 Precio Final</h4>
            <div className="price-input-group">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                className="price-input"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                min="0"
                step="10"
              />
              <div className="price-buttons">
                <button 
                  className="btn-price-adjust"
                  onClick={() => setFinalPrice(servicePrice)}
                  title="Precio original"
                >
                  Original
                </button>
                <button 
                  className="btn-price-adjust"
                  onClick={() => setFinalPrice(Math.max(0, parseFloat(finalPrice) - 50))}
                  title="-$50"
                >
                  -$50
                </button>
                <button 
                  className="btn-price-adjust"
                  onClick={() => setFinalPrice(parseFloat(finalPrice) + 50)}
                  title="+$50"
                >
                  +$50
                </button>
              </div>
            </div>

            {/* Mostrar diferencia */}
            {finalPrice !== servicePrice && (
              <div className={`price-difference ${discount > 0 ? 'discount' : 'extra'}`}>
                {discount > 0 ? (
                  <>
                    ✨ Descuento: ${discount} ({discountPercentage}%)
                  </>
                ) : (
                  <>
                    ➕ Cargo extra: ${Math.abs(discount)}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Método de pago */}
          <div className="payment-section">
            <h4>💳 Método de Pago</h4>
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💵</span>
                <span className="payment-label">Efectivo</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">💳</span>
                <span className="payment-label">Tarjeta</span>
              </label>

              <label className={`payment-option ${paymentMethod === 'transfer' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="payment-icon">📱</span>
                <span className="payment-label">Transferencia</span>
              </label>
            </div>
          </div>

          {/* Notas adicionales */}
          <div className="notes-section">
            <h4>📝 Notas (Opcional)</h4>
            <textarea
              className="form-control"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ejemplo: Cliente muy satisfecho, pidió cita para la próxima semana..."
            />
          </div>

          {/* Total a cobrar */}
          <div className="total-section">
            <div className="total-label">Total a Cobrar:</div>
            <div className="total-amount">${finalPrice}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button 
            className="btn btn-primary btn-complete"
            onClick={handleConfirm}
          >
            ✅ Marcar como Completada
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteAppointmentModal;