import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import StudentManagement from './StudentManagement';
import PaymentManagement from './PaymentManagement';
import NewsManagement from './NewsManagement';
import ClassesManagement from './ClassesManagement';
import ReportManagement from './ReportManagement';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user } = useAuth();
  const role = user?.role || '';
  const isTeacher = String(role).toUpperCase() === 'TEACHER';

  const allowedSections = useMemo(() => {
    if (isTeacher) {
      return ['dashboard', 'students', 'classes'];
    }
    return ['dashboard', 'students', 'payments', 'news', 'classes', 'reports'];
  }, [isTeacher]);

  useEffect(() => {
    const section = new URLSearchParams(location.search).get('section');
    if (section && allowedSections.includes(section)) {
      setActiveSection(section);
    } else if (section && !allowedSections.includes(section)) {
      setActiveSection('dashboard');
    }
  }, [location.search, allowedSections]);

  useEffect(() => {
    if (!allowedSections.includes(activeSection)) {
      setActiveSection('dashboard');
    }
  }, [activeSection, allowedSections]);

  
  const renderSection = () => {
    switch (activeSection) {
      case 'students':
        return <StudentManagement />;
      case 'payments':
        if (isTeacher) return null;
        return <PaymentManagement />;
      case 'news':
        if (isTeacher) return null;
        return <NewsManagement />;
      case 'classes':
        return <ClassesManagement />;
      case 'reports':
        if (isTeacher) return null;
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

            {!isTeacher && (
              <>
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

                {/* Sección de Reportes */}
                <div className="admin-card">
                  <div className="card-icon">📊</div>
                  <h2>Reportes</h2>
                  <p>Genera reportes y estadísticas de la academia</p>
                  <button className="card-button" onClick={() => setActiveSection('reports')}>Ver Reportes</button>
                </div>

                 {/* sección de testimonios */}
                <div className="admin-card">
                  <div className="card-icon">📝</div>
                  <h2>Testimonios</h2>
                  <p>Generar testimonios, editar y eliminar</p>
                  <button className="card-button" onClick={() => navigate('/testimonials')}>Ver testimonios</button>
                </div>

              </>
            )}
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
