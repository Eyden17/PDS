import React, { useState, useMemo, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import '../styles/StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const showTable = !loading && !error;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Filtros
  const [filterGroup, setFilterGroup] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterAgeRange, setFilterAgeRange] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    segundoApellido: '',
    edad: '',
    encargado: '',
    telefonoEncargado: '',
    observaciones: '',
    grupo: '',
    activo: true
  });

  // TODO: ajustar según datos reales de backend
  const grupos = [
    { label: 'Babies (3-5 años)', icon: '👶', color: '#ec4899' },
    { label: 'Minies (6+ años)', icon: '🎀', color: '#8b5cf6' },
    { label: 'Artes Proféticas', icon: '✨', color: '#f4a460' }
  ];

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAllStudents({ limit: 100, offset: 0 });

      // backend recomendado: { data: [...] }
      const rows = res?.data ?? res ?? [];

      console.log('Fetched students:', rows);

      // Mapeo a tu forma actual de UI
      const mapped = rows.map((s) => {
        const age =
          s.birth_date
            ? Math.max(0, new Date().getFullYear() - new Date(s.birth_date).getFullYear())
            : '';

        // convertir group_name ("Babies") a label UI ("Babies (3-5 años)")
        const grupoLabel =
          s.group_name === 'Babies' ? 'Babies (3-5 años)' :
          s.group_name === 'Minies' ? 'Minies (6+ años)' :
          s.group_name === 'Artes Proféticas' ? 'Artes Proféticas' :
          '';

        return {
          id: s.id,
          nombre: s.first_name ?? '',
          apellido: s.last_name ?? '',
          segundoApellido: '',
          edad: age ? String(age) : '',
          encargado: s.guardian_name ?? '',
          telefonoEncargado: s.guardian_phone ?? '',
          observaciones: s.condition_notes ?? '',
          grupo: grupoLabel,
          activo: Boolean(s.is_active),

          // extra opcional (si luego lo querés mostrar)
          classId: s.class_id ?? null,
          className: s.class_name ?? null
        };
      });

      setStudents(mapped);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error cargando estudiantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddStudent = () => {
    if (!formData.nombre || !formData.apellido || !formData.encargado || !formData.telefonoEncargado || !formData.grupo) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (editingId) {
      setStudents(students.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
      setEditingId(null);
    } else {
      const newStudent = {
        id: Date.now(),
        ...formData
      };
      setStudents([...students, newStudent]);
    }
    
    setFormData({
      nombre: '',
      apellido: '',
      segundoApellido: '',
      edad: '',
      encargado: '',
      telefonoEncargado: '',
      observaciones: '',
      grupo: '',
      activo: true
    });
    setShowForm(false);
  };

  const handleEditStudent = (student) => {
    setFormData(student);
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleDeleteStudent = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDeleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      apellido: '',
      segundoApellido: '',
      edad: '',
      encargado: '',
      telefonoEncargado: '',
      observaciones: '',
      grupo: '',
      activo: true
    });
  };

  // Filtrado de estudiantes
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchGroup = !filterGroup || student.grupo === filterGroup;
      const matchName = !filterName || student.nombre.toLowerCase().includes(filterName.toLowerCase()) || 
                        student.apellido.toLowerCase().includes(filterName.toLowerCase());
      
      let matchAge = true;
      if (filterAgeRange) {
        const age = parseInt(student.edad);
        if (filterAgeRange === '3-5' && (age < 3 || age > 5)) matchAge = false;
        if (filterAgeRange === '6-11' && (age < 6 || age > 11)) matchAge = false;
        if (filterAgeRange === '12+' && age < 12) matchAge = false;
      }
      
      return matchGroup && matchName && matchAge;
    });
  }, [students, filterGroup, filterName, filterAgeRange]);

  // Estadísticas
  const totalStudents = students.length;
  const studentsByGroup = grupos.map(g => ({
    ...g,
    count: students.filter(s => s.grupo === g.label).length
  }));
  
  const getGroupIcon = (grupo) => {
    const groupData = grupos.find(g => g.label === grupo);
    return groupData ? groupData.icon : '📚';
  };

  const getGroupColor = (grupo) => {
    const groupData = grupos.find(g => g.label === grupo);
    return groupData ? groupData.color : '#667eea';
  };

  return (
    <div className="student-management">
      <div className="management-header">
        <div className="header-content">
          <h2>Gestión de Estudiantes</h2>
          <p className="header-subtitle">Administra información de estudiantes, grupos y expedientes</p>
        </div>
        <button 
          className="btn-add-student"
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setEditingId(null);
              setFormData({
                nombre: '',
                apellido: '',
                segundoApellido: '',
                edad: '',
                encargado: '',
                telefonoEncargado: '',
                observaciones: '',
                grupo: '',
                activo: true
              });
              setShowForm(true);
            }
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Agregar Estudiante'}
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Estudiantes</p>
            <p className="stat-value">{totalStudents}</p>
          </div>
        </div>
        
        {studentsByGroup.map(group => (
          <div key={group.label} className="stat-card" style={{ borderLeftColor: group.color }}>
            <div className="stat-icon" style={{ color: group.color }}>{group.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{group.label}</p>
              <p className="stat-value">{group.count} estudiantes</p>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-container">
          <h3 className="form-title">{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</h3>
          <form className="student-form">
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  required
                />
              </div>
              <div className="form-group">
                <label>2do Apellido</label>
                <input
                  type="text"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleInputChange}
                  placeholder="Segundo Apellido"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Edad</label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  placeholder="Edad"
                  min="1"
                  max="150"
                />
              </div>
              <div className="form-group">
                <label>Grupo *</label>
                <select
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar grupo</option>
                  <option value="Babies (3-5 años)">Babies (3-5 años)</option>
                  <option value="Minies (6+ años)">Minies (6+ años)</option>
                  <option value="Artes Proféticas">Artes Proféticas</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                  <span className={`checkbox-label ${formData.activo ? 'active' : 'inactive'}`}>
                    {formData.activo ? '✓ Estudiante Activo' : '✗ Estudiante Inactivo'}
                  </span>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Encargado *</label>
                <input
                  type="text"
                  name="encargado"
                  value={formData.encargado}
                  onChange={handleInputChange}
                  placeholder="Nombre del encargado"
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono Encargado *</label>
                <input
                  type="tel"
                  name="telefonoEncargado"
                  value={formData.telefonoEncargado}
                  onChange={handleInputChange}
                  placeholder="+506 XXXX XXXX"
                  required
                />
              </div>
            </div>

            <div className="form-row full-width">
              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="Añade cualquier observación importante..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-submit"
                onClick={handleAddStudent}
              >
                {editingId ? 'Actualizar Estudiante' : 'Agregar Estudiante'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Filtros de Búsqueda</h3>
        </div>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Por Grupo</label>
            <select value={filterGroup} onChange={(e) => setFilterGroup(e.target.value)}>
              <option value="">Todos los grupos</option>
              <option value="Babies (3-5 años)">Babies (3-5 años)</option>
              <option value="Minies (6+ años)">Minies (6+ años)</option>
              <option value="Artes Proféticas">Artes Proféticas</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Por Nombre</label>
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Por Edad</label>
            <select value={filterAgeRange} onChange={(e) => setFilterAgeRange(e.target.value)}>
              <option value="">Todas las edades</option>
              <option value="3-5">3-5 años</option>
              <option value="6-11">6-11 años</option>
              <option value="12+">12+ años</option>
            </select>
          </div>

          <button 
            className="btn-reset-filters"
            onClick={() => {
              setFilterGroup('');
              setFilterName('');
              setFilterAgeRange('');
            }}
          >
            Limpiar Filtros
          </button>
        </div>
        <p className="filters-result">Mostrando {filteredStudents.length} de {students.length} estudiantes</p>
      </div>

      {/* Tabla de Estudiantes */}
      <div className="students-table-container">

        {loading && (
          <div className="empty-state">
            <p>⏳ Cargando estudiantes...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {showTable && (filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>No hay estudiantes registrados</p>
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th className="col-status">Estado</th>
                <th className="col-name">Nombre Completo</th>
                <th className="col-age">Edad</th>
                <th className="col-group">Grupo</th>
                <th className="col-guardian">Encargado</th>
                <th className="col-phone">Teléfono</th>
                <th className="col-obs">Observaciones</th>
                <th className="col-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id} className={`student-row ${!student.activo ? 'inactive-row' : ''}`}>
                  <td className="col-status">
                    <span className={`status-badge ${student.activo ? 'active' : 'inactive'}`}>
                      {student.activo ? '✓ Activo' : '✗ Inactivo'}
                    </span>
                  </td>
                  <td className="col-name">
                    <span className={`student-name ${!student.activo ? 'inactive-text' : ''}`}>{student.nombre} {student.apellido} {student.segundoApellido}</span>
                  </td>
                  <td className="col-age">
                    <span className="age-badge">{student.edad || '-'} años</span>
                  </td>
                  <td className="col-group">
                    <span className="group-badge" style={{ borderLeftColor: getGroupColor(student.grupo) }}>
                      {getGroupIcon(student.grupo)} {student.grupo}
                    </span>
                  </td>
                  <td className="col-guardian">{student.encargado}</td>
                  <td className="col-phone">
                    <a href={`tel:${student.telefonoEncargado}`} className="phone-link">
                      {student.telefonoEncargado}
                    </a>
                  </td>
                  <td className="col-obs">
                    <span className="obs-text">{student.observaciones || '-'}</span>
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEditStudent(student)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteStudent(student.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>

      <div className="management-footer">
        <p>Total de estudiantes: <strong>{totalStudents}</strong> | Mostrando: <strong>{filteredStudents.length}</strong></p>
      </div>

      {/* Modal de Confirmación para Eliminar */}
      {deleteConfirm && (
        <div className="modal-overlay delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <div className="delete-modal-icon">⚠️</div>
              <h2>Eliminar Estudiante</h2>
            </div>
            
            <div className="delete-modal-body">
              <p className="delete-warning">
                ¿Estás seguro de que deseas eliminar este estudiante?
              </p>
              <p className="delete-info">
                Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al estudiante.
              </p>
              
              {students.find(s => s.id === deleteConfirm) && (
                <div className="delete-student-info">
                  <h3>{students.find(s => s.id === deleteConfirm).nombre} {students.find(s => s.id === deleteConfirm).apellido}</h3>
                  <p className="student-grupo">
                    Grupo: <strong>{students.find(s => s.id === deleteConfirm).grupo}</strong>
                  </p>
                </div>
              )}
            </div>

            <div className="delete-modal-actions">
              <button
                className="btn-delete-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button
                className="btn-delete-confirm"
                onClick={() => confirmDeleteStudent(deleteConfirm)}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
