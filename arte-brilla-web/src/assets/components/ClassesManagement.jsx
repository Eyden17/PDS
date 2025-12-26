import React, { useState, useMemo } from 'react';
import '../styles/ClassesManagement.css';

const ClassesManagement = () => {
  const [clases, setClases] = useState([
    { id: 1, nombre: 'Danza Contemporánea Babies', instructor: 'María García', area: 'Babies', horario: 'Lunes y Miércoles', hora: '4:00 PM - 5:00 PM', capacidad: 15, inscritos: 12, nivel: 'Principiante', descripcion: 'Iniciación a la danza moderna para niños de 3-5 años', activa: true },
    { id: 2, nombre: 'Ballet Clásico Minies', instructor: 'Carlos López', area: 'Minies', horario: 'Martes y Jueves', hora: '5:30 PM - 6:30 PM', capacidad: 20, inscritos: 18, nivel: 'Intermedio', descripcion: 'Técnica de ballet clásico para niños de 6+ años', activa: true },
    { id: 3, nombre: 'Jazz Fusion', instructor: 'Sandra Mendez', area: 'Minies', horario: 'Sábado', hora: '2:00 PM - 3:30 PM', capacidad: 18, inscritos: 14, nivel: 'Intermedio', descripcion: 'Fusión de jazz con elementos modernos', activa: true },
    { id: 4, nombre: 'Artes Proféticas Avanzado', instructor: 'Pastor David', area: 'Artes Proféticas', horario: 'Viernes', hora: '7:00 PM - 8:30 PM', capacidad: 25, inscritos: 20, nivel: 'Avanzado', descripcion: 'Danza profética para todas las edades', activa: true },
    { id: 5, nombre: 'Hip Hop Kids', instructor: 'Juan Rodríguez', area: 'Minies', horario: 'Miércoles', hora: '6:00 PM - 7:00 PM', capacidad: 16, inscritos: 8, nivel: 'Principiante', descripcion: 'Hip hop adaptado para niños', activa: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filterArea, setFilterArea] = useState('Todas');
  const [filterBusqueda, setFilterBusqueda] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    instructor: '',
    area: 'Babies',
    horario: '',
    hora: '',
    capacidad: 15,
    nivel: 'Principiante',
    descripcion: '',
    activa: true
  });

  const areas = ['Babies', 'Minies', 'Artes Proféticas'];
  const niveles = ['Principiante', 'Intermedio', 'Avanzado'];
  const colorArea = {
    'Babies': '#ec4899',
    'Minies': '#8b5cf6',
    'Artes Proféticas': '#f4a460'
  };
  const iconoArea = {
    'Babies': '👶',
    'Minies': '🎀',
    'Artes Proféticas': '✨'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'capacidad' ? parseInt(value) : value)
    }));
  };

  const handleAddClase = () => {
    if (!formData.nombre.trim() || !formData.instructor.trim() || !formData.horario.trim() || !formData.hora.trim()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (editingId) {
      setClases(clases.map(c =>
        c.id === editingId
          ? { ...formData, id: editingId }
          : c
      ));
    } else {
      const newClase = {
        ...formData,
        id: Math.max(...clases.map(c => c.id), 0) + 1,
        inscritos: 0
      };
      setClases([newClase, ...clases]);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      instructor: '',
      area: 'Babies',
      horario: '',
      hora: '',
      capacidad: 15,
      nivel: 'Principiante',
      descripcion: '',
      activa: true
    });
    setEditingId(null);
  };

  const handleEditClase = (clase) => {
    setFormData(clase);
    setEditingId(clase.id);
    setShowForm(true);
  };

  const handleDeleteClase = (clase) => {
    setDeleteModal(clase);
  };

  const confirmarDelete = () => {
    setClases(clases.filter(c => c.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const clasesFiltradas = useMemo(() => {
    return clases.filter(c => {
      const matchArea = filterArea === 'Todas' || c.area === filterArea;
      const matchBusqueda = c.nombre.toLowerCase().includes(filterBusqueda.toLowerCase()) ||
                           c.instructor.toLowerCase().includes(filterBusqueda.toLowerCase());
      return matchArea && matchBusqueda;
    });
  }, [clases, filterArea, filterBusqueda]);

  const statsActivas = clases.filter(c => c.activa).length;
  const capacidadTotal = clases.reduce((sum, c) => sum + c.capacidad, 0);
  const inscritosTotal = clases.reduce((sum, c) => sum + c.inscritos, 0);
  const areaStats = {};
  clases.forEach(c => {
    areaStats[c.area] = (areaStats[c.area] || 0) + 1;
  });

  return (
    <div className="classes-management">
      <div className="management-header">
        <h2>📚 Gestión de Clases</h2>
        <button
          className="btn-add-class"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Crear Clase'}
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-label">Total de Clases</div>
            <div className="stat-value">{clases.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Clases Activas</div>
            <div className="stat-value">{statsActivas}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Inscritos / Capacidad</div>
            <div className="stat-value">{inscritosTotal}/{capacidadTotal}</div>
          </div>
        </div>
        {Object.entries(areaStats).map(([area, count]) => (
          <div key={area} className="stat-card">
            <div className="stat-icon" style={{ fontSize: '20px' }}>{iconoArea[area]}</div>
            <div className="stat-content">
              <div className="stat-label">{area}</div>
              <div className="stat-value">{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>🔍 Filtros</h3>
          {(filterArea !== 'Todas' || filterBusqueda) && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setFilterArea('Todas');
                setFilterBusqueda('');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Búsqueda</label>
            <input
              type="text"
              placeholder="Buscar por nombre o instructor..."
              value={filterBusqueda}
              onChange={(e) => setFilterBusqueda(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Área</label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="filter-select"
            >
              <option value="Todas">Todas las áreas</option>
              {areas.map(area => (
                <option key={area} value={area}>{iconoArea[area]} {area}</option>
              ))}
            </select>
          </div>
        </div>
        {clasesFiltradas.length > 0 && (
          <div className="filters-result">
            Mostrando {clasesFiltradas.length} de {clases.length} clases
          </div>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-container">
          <form className="classes-form">
            <h3>{editingId ? 'Editar Clase' : 'Nueva Clase'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Nombre de la Clase *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Danza Contemporánea Babies"
                  required
                />
              </div>

              <div className="form-group">
                <label>Instructor *</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="Nombre del instructor"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Área *</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                >
                  {areas.map(area => (
                    <option key={area} value={area}>{iconoArea[area]} {area}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nivel</label>
                <select
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleInputChange}
                >
                  {niveles.map(nivel => (
                    <option key={nivel} value={nivel}>{nivel}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Horario *</label>
                <input
                  type="text"
                  name="horario"
                  value={formData.horario}
                  onChange={handleInputChange}
                  placeholder="Ej: Lunes y Miércoles"
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora *</label>
                <input
                  type="text"
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                  placeholder="Ej: 4:00 PM - 5:00 PM"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Capacidad</label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción de la clase..."
                rows="3"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className={`checkbox-label ${formData.activa ? 'active' : 'inactive'}`}>
                <input
                  type="checkbox"
                  name="activa"
                  checked={formData.activa}
                  onChange={handleInputChange}
                />
                <span className="checkbox-text">
                  {formData.activa ? '✓ Clase Activa' : '✗ Clase Inactiva'}
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-submit"
                onClick={handleAddClase}
              >
                {editingId ? '💾 Actualizar' : '✓ Crear'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                ✕ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de Clases */}
      <div className="classes-grid-container">
        {clasesFiltradas.length === 0 ? (
          <div className="empty-state">
            <p>📚 {filterBusqueda || filterArea !== 'Todas' ? 'No se encontraron clases con los filtros aplicados' : 'No hay clases creadas aún'}</p>
            <small>Crea tu primera clase para comenzar</small>
          </div>
        ) : (
          clasesFiltradas.map(clase => (
            <div
              key={clase.id}
              className={`class-card ${!clase.activa ? 'inactive' : ''}`}
            >
              <div className="class-header">
                <div className="area-badge" style={{ backgroundColor: colorArea[clase.area] }}>
                  {iconoArea[clase.area]} {clase.area}
                </div>
                <span className={`status-badge ${clase.activa ? 'active' : 'inactive'}`}>
                  {clase.activa ? '✓ Activa' : '✗ Inactiva'}
                </span>
              </div>

              <h4 className={clase.activa ? '' : 'inactive-text'}>{clase.nombre}</h4>

              <div className="class-info">
                <p className="info-item">👨‍🏫 <strong>{clase.instructor}</strong></p>
                <p className="info-item">📅 {clase.horario}</p>
                <p className="info-item">⏰ {clase.hora}</p>
                <p className="info-item">📊 {clase.nivel}</p>
              </div>

              <div className="capacity-bar">
                <div className="capacity-label">
                  <span>Capacidad</span>
                  <span className="capacity-numbers">{clase.inscritos}/{clase.capacidad}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(clase.inscritos / clase.capacidad) * 100}%` }}
                  ></div>
                </div>
              </div>

              {clase.descripcion && (
                <p className="class-description">{clase.descripcion}</p>
              )}

              <div className="class-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditClase(clase)}
                  title="Editar"
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteClase(clase)}
                  title="Eliminar"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Eliminación */}
      {deleteModal && (
        <div className="modal-overlay delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <span className="warning-icon">⚠️</span>
              <h3>Eliminar Clase</h3>
            </div>
            <div className="delete-modal-body">
              <p>¿Estás seguro de que deseas eliminar esta clase?</p>
              <div className="class-preview">
                <div className="preview-info">
                  <h5>{deleteModal.nombre}</h5>
                  <p>Instructor: <strong>{deleteModal.instructor}</strong></p>
                  <p>Área: <strong>{deleteModal.area}</strong></p>
                  <p>Horario: <strong>{deleteModal.horario}</strong></p>
                </div>
              </div>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="delete-modal-actions">
              <button
                className="btn-delete-cancel"
                onClick={() => setDeleteModal(null)}
              >
                ✕ Cancelar
              </button>
              <button
                className="btn-delete-confirm"
                onClick={confirmarDelete}
              >
                ✓ Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesManagement;
