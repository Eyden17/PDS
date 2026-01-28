import React, { useState } from 'react';
import StudentManagement from './StudentManagement';
import PaymentManagement from './PaymentManagement';
import NewsManagement from './NewsManagement';
import ClassesManagement from './ClassesManagement';
import ReportManagement from './ReportManagement';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  
  const [activeSection, setActiveSection] = useState('dashboard');

  
  const renderSection = () => {
    switch (activeSection) {
      case 'students':
        return <StudentManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'news':
        return <NewsManagement />;
      case 'classes':
        return <ClassesManagement />;
      case 'reports':
        return <ReportManagement />;
      default:
        return (
          <div className="dashboard-grid">
            {/* Sección de Estudiantes */}
            <div className="admin-card">
              <div className="card-icon">👥</div>
              <h2>Gestión de Estudiantes</h2>
              <p>Administra información de estudiantes, grupos y expedientes</p>
              <button 
                className="card-button"
                onClick={() => setActiveSection('students')}
              >
                Ir a Estudiantes
              </button>
            </div>

            {/* Sección de Pagos */}
            <div className="admin-card">
              <div className="card-icon">💰</div>
              <h2>Control Financiero</h2>
              <p>Tabla de pagos, semáforo de estado y facturación</p>
              <button 
                className="card-button"
                onClick={() => setActiveSection('payments')}
              >
                Ir a Pagos
              </button>
            </div>

            {/* Sección de Noticias */}
            <div className="admin-card">
              <div className="card-icon">📰</div>
              <h2>Gestión de Noticias</h2>
              <p>Crea y publica noticias con duración automática</p>
              <button 
                className="card-button"
                onClick={() => setActiveSection('news')}
              >
                Ir a Noticias
              </button>
            </div>

            {/* Sección de Clases */}
            <div className="admin-card">
              <div className="card-icon">📚</div>
              <h2>Gestión de Clases</h2>
              <p>Crea y edita clases, horarios e instructores</p>
              <button 
                className="card-button"
                onClick={() => setActiveSection('classes')}
              >
                Ir a Clases
              </button>
            </div>

            {/* Sección de Reportes */}
            <div className="admin-card">
              <div className="card-icon">📊</div>
              <h2>Reportes</h2>
              <p>Genera reportes y estadísticas de la academia</p>
              <button className="card-button" onClick={() => setActiveSection('reports')}>Ver Reportes</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title-section">
          <h1>Panel Administrativo</h1>
          <p className="admin-subtitle">Gestión de Arte Brilla</p>
        </div>
      </div>

      {activeSection !== 'dashboard' && (
        <button 
          className="btn-back"
          onClick={() => setActiveSection('dashboard')}
        >
          ← Volver al Panel Principal
        </button>
      )}

      <div className="admin-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPanel;
