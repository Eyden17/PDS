import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title-section">
          <h1>Panel Administrativo</h1>
          <p className="admin-subtitle">Gestión de Arte Brilla</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div className="admin-content">
        <div className="dashboard-grid">
          {/* Sección de Estudiantes */}
          <div className="admin-card">
            <div className="card-icon">👥</div>
            <h2>Gestión de Estudiantes</h2>
            <p>Administra información de estudiantes, grupos y expedientes</p>
            <button className="card-button">Ir a Estudiantes</button>
          </div>

          {/* Sección de Pagos */}
          <div className="admin-card">
            <div className="card-icon">💰</div>
            <h2>Control Financiero</h2>
            <p>Tabla de pagos, semáforo de estado y facturación</p>
            <button className="card-button">Ir a Pagos</button>
          </div>

          {/* Sección de Clases */}
          <div className="admin-card">
            <div className="card-icon">📚</div>
            <h2>Gestión de Clases</h2>
            <p>Crea y edita clases, horarios e instructores</p>
            <button className="card-button">Ir a Clases</button>
          </div>

          {/* Sección de Comunicación */}
          <div className="admin-card">
            <div className="card-icon">📢</div>
            <h2>Comunicación</h2>
            <p>Envía anuncios masivos y gestiona inventario</p>
            <button className="card-button">Ir a Comunicación</button>
          </div>

          {/* Sección de Reportes */}
          <div className="admin-card">
            <div className="card-icon">📊</div>
            <h2>Reportes</h2>
            <p>Genera reportes y estadísticas de la academia</p>
            <button className="card-button">Ver Reportes</button>
          </div>

          {/* Sección de Configuración */}
          <div className="admin-card">
            <div className="card-icon">⚙️</div>
            <h2>Configuración</h2>
            <p>Ajusta parámetros y preferencias del sistema</p>
            <button className="card-button">Ir a Configuración</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
