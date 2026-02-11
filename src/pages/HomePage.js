// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/common/ServiceCard';
import { services, businessInfo } from '../services/servicesData';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero circuit-pattern">
        <div className="hero-content animate-fade-in">
          <div className="hero-badge">✨ Sistema Profesional de Citas</div>
          <h1 className="hero-title">
            Bienvenido a <span className="highlight">{businessInfo.name}</span>
          </h1>
          <p className="hero-subtitle">
            El mejor estilo, profesionalismo y atención personalizada
          </p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-secondary btn-lg">
              📅 Agendar Cita Ahora
            </Link>
            <Link to="/my-appointments" className="btn btn-outline btn-lg">
              🔍 Ver Mis Citas
            </Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="floating-icon">💈</div>
          <div className="floating-icon delay-1">✂️</div>
          <div className="floating-icon delay-2">💇‍♂️</div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">¿Cómo Funciona?</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <p1>Elige tu Servicio<br></br></p1>
              <p>Selecciona el servicio que deseas de nuestro catálogo</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">2</div>
              <p1>Selecciona Fecha y Hora<br></br></p1>
              <p>Elige el día y horario que mejor te convenga</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">3</div>
              <p1>Confirma tu Cita<br></br></p1>
              <p>Ingresa tus datos y confirma. Recibirás notificación</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step-card">
              <div className="step-number">4</div>
              <p1>¡Listo!</p1>
              <p>Revisa el estado de tu cita en cualquier momento</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="section-subtitle">
              Servicios profesionales con la mejor atención y precios competitivos
            </p>
          </div>
          
          <div className="services-grid">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="section-cta">
            <Link to="/book" className="btn btn-primary btn-lg">
              Ver Horarios Disponibles →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Agenda Online</h3>
              <p>Reserva tu cita 24/7 desde cualquier dispositivo</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Confirmación Instantánea</h3>
              <p>Recibe notificación del estado de tu cita</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Horarios Flexibles</h3>
              <p>Múltiples horarios disponibles cada día</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Soporte WhatsApp</h3>
              <p>Contacto directo con el barbero</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="final-cta circuit-pattern">
        <div className="container">
          <h2>¿Listo para tu nuevo look?</h2>
          <p>Agenda tu cita ahora y recibe confirmación instantánea</p>
          <div className="cta-buttons">
            <Link to="/book" className="btn btn-secondary btn-lg">
              📅 Agendar Ahora
            </Link>
            <a 
              href={`https://wa.me/52${businessInfo.phone}?text=${encodeURIComponent(businessInfo.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              💬 Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
