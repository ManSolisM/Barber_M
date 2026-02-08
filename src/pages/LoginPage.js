// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular delay de autenticación
    setTimeout(() => {
      const success = login(credentials.username, credentials.password);
      
      if (success) {
        navigate('/owner/dashboard');
      } else {
        setError('❌ Usuario o contraseña incorrectos');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-page circuit-pattern">
      <div className="login-container">
        <div className="login-card animate-slide-up">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h2>Acceso de Dueño</h2>
            <p>Ingresa tus credenciales para administrar las citas</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-danger animate-slide-down">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="username">
                <span className="label-icon">👤</span>
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={credentials.username}
                onChange={handleChange}
                required
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔑</span>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verificando...
                </>
              ) : (
                <>
                  🚀 Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="demo-info">
              <strong>📋 Credenciales de Demostración:</strong>
              <div className="demo-credentials">
                <span>Usuario: <code>admin</code></span>
                <span>Contraseña: <code>admin123</code></span>
              </div>
              <p className="demo-warning">
                ⚠️ Cambia estas credenciales en producción
              </p>
            </div>
          </div>

          <div className="login-links">
            <a href="/" className="back-link">
              ← Volver al Inicio
            </a>
          </div>
        </div>

        <div className="login-features">
          <h3>Panel de Administración</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Aceptar o rechazar citas</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Ver estadísticas en tiempo real</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📅</span>
              <span>Gestionar agenda completa</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <span>Contactar clientes por WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
