import React, { useState, useMemo, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import '../styles/StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');
  const [originalFormData, setOriginalFormData] = useState(null);

  const showTable = !loading && !error;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Filtros
  const [filterGroup, setFilterGroup] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterAgeRange, setFilterAgeRange] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    cedula: '',
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

  const grupos = [
    { label: 'Babies (3-5 años)', icon: '👶', color: '#ec4899' },
    { label: 'Minies (6+ años)', icon: '🎀', color: '#8b5cf6' },
    { label: 'Artes Proféticas', icon: '✨', color: '#f4a460' }
  ];
  const ageRangesByGroup = {
    'Babies (3-5 años)': { min: 3, max: 5 },
    'Minies (6+ años)': { min: 6, max: 11 },
    'Artes Proféticas': { min: 12, max: null }
  };

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

        const [apellido, ...segundoApellido] = (s.last_name ?? '').trim().split(' ');
        return {
          id: s.id,
          cedula: s.identification ?? '',
          nombre: s.first_name ?? '',
          apellido: apellido ?? '',
          segundoApellido: segundoApellido[0] ?? '',
          edad: age ? String(age) : '',
          encargado: s.guardian_name ?? '',
          telefonoEncargado: s.guardian_phone ?? '',
          observaciones: s.condition_notes ?? '',
          grupo: grupoLabel,
          activo: Boolean(s.is_active),
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
    if (formError) setFormError('');
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isOnlyLettersSpaces = (value) => {
    if (!value) return true;
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(value);
  };

  const validateForm = () => {
    if (
      !formData.cedula?.trim() ||
      !formData.nombre?.trim() ||
      !formData.apellido?.trim() ||
      !formData.encargado?.trim() ||
      !formData.telefonoEncargado?.trim() ||
      !formData.grupo
    ) {
      return 'Por favor completa todos los campos requeridos (incluida la cédula).';
    }

    const cedula = formData.cedula.trim();
    if (!/^\d{9}$/.test(cedula)) {
      return 'La cédula debe tener exactamente 9 números.';
    }

    const telefono = formData.telefonoEncargado.trim();
    if (!/^\d{8}$/.test(telefono)) {
      return 'El teléfono debe tener exactamente 8 números.';
    }

    if (formData.edad) {
      const edad = Number(formData.edad);
      if (!Number.isFinite(edad) || edad < 3) {
        return 'La edad debe ser 3 o mayor.';
      }

      if (formData.grupo) {
        const range = ageRangesByGroup[formData.grupo];
        if (range) {
          if (edad < range.min) {
            return `Para el grupo seleccionado, la edad debe ser ${range.min} o mayor.`;
          }
          if (range.max != null && edad > range.max) {
            return `Para el grupo seleccionado, la edad debe estar entre ${range.min} y ${range.max}.`;
          }
        }
      }
    }

    if (!isOnlyLettersSpaces(formData.nombre)) {
      return 'El nombre solo puede tener letras y espacios.';
    }

    if (!isOnlyLettersSpaces(formData.apellido)) {
      return 'El apellido solo puede tener letras y espacios.';
    }

    if (formData.segundoApellido && !isOnlyLettersSpaces(formData.segundoApellido)) {
      return 'El 2do apellido solo puede tener letras y espacios.';
    }

    if (!isOnlyLettersSpaces(formData.encargado)) {
      return 'El encargado solo puede tener letras y espacios.';
    }

    if (formData.observaciones && /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/.test(formData.observaciones)) {
      return 'Observaciones contiene caracteres inválidos.';
    }

    return '';
  };

  const handleAddStudent = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    // UI label -> BD group_name
    const groupName =
      formData.grupo === 'Babies (3-5 años)' ? 'Babies' :
      formData.grupo === 'Minies (6+ años)' ? 'Minies' :
      formData.grupo === 'Artes Proféticas' ? 'Artes Proféticas' :
      null;

    if (!groupName) {
      setFormError('Grupo inválido.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        identification: formData.cedula.trim(),
        first_name: formData.nombre.trim(),
        last_name: `${formData.apellido.trim()}${formData.segundoApellido?.trim() ? ` ${formData.segundoApellido.trim()}` : ''}`,
        age: formData.edad ? Number(formData.edad) : null,
        guardian_name: formData.encargado.trim(),
        guardian_phone: formData.telefonoEncargado.trim(),
        condition_notes: formData.observaciones?.trim() || null,
        is_active: Boolean(formData.activo),
        group_name: groupName
      };

      // Crear / Actualizar vía API
      if (editingId) {
        if (originalFormData) {
          const normalizedCurrent = {
            ...formData,
            cedula: formData.cedula.trim(),
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            segundoApellido: formData.segundoApellido?.trim() || '',
            encargado: formData.encargado.trim(),
            telefonoEncargado: formData.telefonoEncargado.trim(),
            observaciones: formData.observaciones?.trim() || '',
            edad: formData.edad ? String(Number(formData.edad)) : '',
            grupo: formData.grupo,
            activo: Boolean(formData.activo)
          };
          const normalizedOriginal = {
            ...originalFormData,
            cedula: originalFormData.cedula.trim(),
            nombre: originalFormData.nombre.trim(),
            apellido: originalFormData.apellido.trim(),
            segundoApellido: originalFormData.segundoApellido?.trim() || '',
            encargado: originalFormData.encargado.trim(),
            telefonoEncargado: originalFormData.telefonoEncargado.trim(),
            observaciones: originalFormData.observaciones?.trim() || '',
            edad: originalFormData.edad ? String(Number(originalFormData.edad)) : '',
            grupo: originalFormData.grupo,
            activo: Boolean(originalFormData.activo)
          };

          if (JSON.stringify(normalizedCurrent) === JSON.stringify(normalizedOriginal)) {
            setFormError('No hay cambios para guardar.');
            return;
          }
        }

        await studentService.updateStudent(editingId, payload);
        setEditingId(null);
      } else {
        const exists = students.some(s => s.cedula === formData.cedula.trim());
        if (exists) {
          setFormError('Ya existe un estudiante con esa cédula.');
          return;
        }
        await studentService.createStudent(payload);
      }

      await fetchStudents();
      setFormData({
        cedula: '',
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
      setOriginalFormData(null);
    } catch (err) {
      if (err?.code === 'DUPLICATE_IDENTIFICATION') {
        setFormError('Ya existe un estudiante con esa cédula.');
      } else {
        setError(err.message || 'Error guardando estudiante');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleEditStudent = (student) => {
    setFormError('');
    setOriginalFormData({
      cedula: student.cedula ?? '',
      nombre: student.nombre ?? '',
      apellido: student.apellido ?? '',
      segundoApellido: student.segundoApellido ?? '',
      edad: student.edad ?? '',
      encargado: student.encargado ?? '',
      telefonoEncargado: student.telefonoEncargado ?? '',
      observaciones: student.observaciones ?? '',
      grupo: student.grupo ?? '',
      activo: Boolean(student.activo)
    });
    setFormData({
      cedula: student.cedula ?? '',
      nombre: student.nombre ?? '',
      apellido: student.apellido ?? '',
      segundoApellido: student.segundoApellido ?? '',
      edad: student.edad ?? '',
      encargado: student.encargado ?? '',
      telefonoEncargado: student.telefonoEncargado ?? '',
      observaciones: student.observaciones ?? '',
      grupo: student.grupo ?? '',
      activo: Boolean(student.activo)
    });

    setEditingId(student.id);
    setShowForm(true);
  };


  const handleDeleteStudent = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDeleteStudent = async (id) => {
    try {
      setLoading(true);
      setError(null);

      await studentService.deleteStudent(id);
      await fetchStudents();

      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'Error eliminando estudiante');
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      cedula: '',
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
      {(formError || error) && (
        <div className="toast-stack" role="status" aria-live="polite">
          {formError && <div className="toast-error">{formError}</div>}
          {error && <div className="toast-error">{error}</div>}
        </div>
      )}
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
                cedula: '',
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
                <label>Cédula *</label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) =>
                    setFormData({ ...formData, cedula: e.target.value })
                  }
                  placeholder="123456789"
                  required
                  disabled={!!editingId}
                />
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
                  placeholder="88888888"
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
            <p>
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              <span>Cargando estudiantes...</span>
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-state error-state">
            <p>
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
              <span>{error}</span>
            </p>
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


