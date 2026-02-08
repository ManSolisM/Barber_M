// src/components/common/ServiceCard.js
import React from 'react';
import '../../styles/ServiceCard.css';

const ServiceCard = ({ service, onSelect, selected }) => {
  return (
    <div 
      className={`service-card ${selected ? 'selected' : ''} ${!service.available ? 'unavailable' : ''}`}
      onClick={() => service.available && onSelect && onSelect(service)}
      style={{ cursor: onSelect && service.available ? 'pointer' : 'default' }}
    >
      <div className="service-icon-wrapper">
        <span className="service-icon">{service.icon}</span>
      </div>
      <h3 className="service-name">{service.name}</h3>
      <p className="service-description">{service.description}</p>
      <div className="service-details">
        <span className="service-price">${service.price}</span>
        <span className="service-duration">⏱️ {service.duration} min</span>
      </div>
      {!service.available && (
        <div className="service-unavailable">No disponible</div>
      )}
      {selected && <div className="service-selected-badge">✓ Seleccionado</div>}
    </div>
  );
};

export default ServiceCard;
