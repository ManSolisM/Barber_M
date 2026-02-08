// src/components/common/Footer.js
import React from 'react';
import { businessInfo } from '../../services/servicesData';
import '../../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer circuit-pattern">
      <div className="footer-container">
        <div className="footer-section">
          <h3>📍 Ubicación</h3>
          <p>{businessInfo.address}</p>
          <p className="contact-email">
            <span>📧</span> {businessInfo.email}
          </p>
        </div>
        
        <div className="footer-section">
          <h3>⏰ Horario</h3>
          <p>{businessInfo.schedule.weekdays}</p>
          <p>{businessInfo.schedule.saturday}</p>
          <p className="closed-day">{businessInfo.schedule.sunday}</p>
        </div>
        
        <div className="footer-section">
          <h3>📞 Contacto</h3>
          <p>Tel: {businessInfo.phone}</p>
          <a 
            href={`https://wa.me/52${businessInfo.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            <span>💬</span> WhatsApp
          </a>
        </div>

        <div className="footer-section">
          <h3>🔗 Enlaces</h3>
          <div className="footer-links">
            <a href="/">Inicio</a>
            <a href="/book">Agendar Cita</a>
            <a href="/my-appointments">Mis Citas</a>
            <a href="/owner/login">Acceso Dueño</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            &copy; {currentYear} {businessInfo.name}. Todos los derechos reservados.
          </p>
          <p className="creator-credit">
            Desarrollado por{' '}
            <a 
              href="https://jamelz.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="jamelz-brand"
            >
              JAMELZ
            </a>
            {' '}🐫✨
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
