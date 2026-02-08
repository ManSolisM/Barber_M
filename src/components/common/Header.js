// src/components/common/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header circuit-pattern">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">💈</span>
          <div className="logo-text">
            <span className="logo-name">Barbería Elegante</span>
            <span className="logo-tagline">Estilo & Profesionalismo</span>
          </div>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${isActive('/')}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">🏠</span>
            Inicio
          </Link>
          
          <Link 
            to="/book" 
            className={`nav-link ${isActive('/book')}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">📅</span>
            Agendar
          </Link>
          
          <Link 
            to="/my-appointments" 
            className={`nav-link ${isActive('/my-appointments')}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">🔍</span>
            Mis Citas
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/owner/dashboard" 
                className={`nav-link owner-link ${isActive('/owner/dashboard')}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-icon">⚙️</span>
                Dashboard
              </Link>
              <button 
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }} 
                className="nav-link logout-btn"
              >
                <span className="nav-icon">🚪</span>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link 
              to="/owner/login" 
              className={`nav-link owner-link ${isActive('/owner/login')}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-icon">🔐</span>
              Acceso Dueño
            </Link>
          )}
        </nav>
      </div>
      
      {isAuthenticated && (
        <div className="user-badge">
          Bienvenido, <strong>{user?.username}</strong>
        </div>
      )}
    </header>
  );
};

export default Header;
