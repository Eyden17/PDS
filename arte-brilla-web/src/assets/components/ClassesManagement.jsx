import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { classService } from "../../services/classService";
import "../styles/ClassesManagement.css";

const HOURS = [
  "06:00", "06:30",
  "07:00", "07:30",
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
  "20:00", "20:30",
  "21:00",
];

function toTimeRange(start, end) {
  if (!start || !end) return "";
  return `${start} - ${end}`;
}

function parseTimeRange(range) {
  // Espera "HH:MM - HH:MM" (o lo que venga parecido)
  const s = String(range || "");
  const parts = s.split("-").map(x => x.trim());
  if (parts.length === 2) return { start: parts[0], end: parts[1] };
  return { start: "", end: "" };
}

const ClassesManagement = () => {
  const { user } = useAuth();
  const role = user?.role || "";
  const isTeacher = String(role).toUpperCase() === "TEACHER";

  const [clases, setClases] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastError, setToastError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filterArea, setFilterArea] = useState("Todas");
  const [filterBusqueda, setFilterBusqueda] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    teacher_id: "",            // ✅ ahora guardamos el id real
    instructor_name: "",       // solo para UI (opcional)
    group_id: "",
    area: "Babies",
    horario: "",               // schedule_days (texto)
    start_time: "",            // ✅ select inicio
    end_time: "",              // ✅ select fin
    capacidad: 15,
    nivel: "Principiante",
    descripcion: "",
    activa: true,
  });

  const areas = ["Babies", "Babies Shine", "Minies", "Artes Proféticas"];
  const niveles = ["Principiante", "Intermedio", "Avanzado"];

  const colorArea = {
    Babies: "#ec4899",
    "Babies Shine": "#22d3ee",
    Minies: "#8b5cf6",
    "Artes Proféticas": "#f4a460",
  };
  const iconoArea = {
    Babies: "👶",
    "Babies Shine": "🌟",
    Minies: "🎀",
    "Artes Proféticas": "✨",
  };

  // ============
  // API load
  // ============
  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [classesRes, teachersRes, groupsRes] = await Promise.all([
        classService.list(),
        classService.listTeachers(),
        classService.listGroups(),
      ]);



      const classesRows = classesRes?.data ?? classesRes ?? [];
      const teachersRows = teachersRes?.data ?? teachersRes ?? [];
      const groupsRows = groupsRes?.data ?? groupsRes ?? [];
      setTeachers(teachersRows);
      setGroups(groupsRows);

      // map classes API -> UI
      const mapped = (classesRows || []).map((c) => {
        const { start, end } = parseTimeRange(c.schedule_time);
        const teacher = teachersRows.find(t => t.id === c.teacher_id);
        const rawArea = c.group_name ?? c.group ?? c.area ?? "Babies";
        const normalizedArea = rawArea === "Baby Shine" ? "Babies Shine" : rawArea;

        return {
          id: c.id,
          nombre: c.name ?? "",
          group_id: c.group_id ?? "",
          area: normalizedArea, // normaliza Baby Shine -> Babies Shine
          horario: c.schedule_days ?? "",
          start_time: start,
          end_time: end,
          capacidad: c.capacity ?? 15,
          inscritos: Number(c.enrolled_count ?? 0),
          nivel: c.level ?? "Principiante",
          descripcion: c.description ?? "",
          activa: Boolean(c.is_active),
          teacher_id: c.teacher_id ?? "",
          instructor: teacher?.full_name ?? "—",
        };
      });

      setClases(mapped);
    } catch (e) {
      setError(e?.message || "Error cargando clases");
      setClases([]);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============
  // Handlers
  // ============
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "capacidad"
          ? parseInt(value || "0", 10)
          : value,
    }));
  };

  const handleTeacherChange = (e) => {
    const teacher_id = e.target.value;
    const t = teachers.find(x => x.id === teacher_id);

    setFormData((prev) => ({
      ...prev,
      teacher_id,
      instructor_name: t?.full_name ?? "",
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      teacher_id: "",
      instructor_name: "",
      group_id: "",
      area: "Babies",
      horario: "",
      start_time: "",
      end_time: "",
      capacidad: 15,
      nivel: "Principiante",
      descripcion: "",
      activa: true,
    });
    setEditingId(null);
  };

  const handleEditClase = (clase) => {
    if (isTeacher) return;
    setFormData({
      nombre: clase.nombre,
      teacher_id: clase.teacher_id || "",
      instructor_name: clase.instructor || "",
      group_id: clase.group_id || "",
      area: clase.area,
      horario: clase.horario || "",
      start_time: clase.start_time || "",
      end_time: clase.end_time || "",
      capacidad: clase.capacidad ?? 15,
      nivel: clase.nivel ?? "Principiante",
      descripcion: clase.descripcion ?? "",
      activa: Boolean(clase.activa),
    });
    setEditingId(clase.id);
    setShowForm(true);
  };

  const handleDeleteClase = (clase) => setDeleteModal(clase);

  const confirmarDelete = async () => {
    if (isTeacher) return;
    try {
      setLoading(true);
      await classService.remove(deleteModal.id);
      setDeleteModal(null);
      await fetchAll();
    } catch (e) {
      setToastError(e?.message || "Error al eliminar la clase");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isTeacher) return;
    setShowForm(false);
    resetForm();
  };

  const handleSaveClase = async () => {
    if (isTeacher) return;
    if (!formData.nombre.trim() || !formData.horario.trim() || !formData.start_time || !formData.end_time) {
      setToastError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setToastError("La hora de inicio debe ser menor que la hora de fin");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.nombre.trim(),
        group_id: Number(formData.group_id),
        teacher_id: formData.teacher_id || null,
        schedule_days: formData.horario.trim(),
        schedule_time: `${formData.start_time} - ${formData.end_time}`,
        capacity: Number(formData.capacidad ?? 15),
        level: formData.nivel,
        description: formData.descripcion?.trim() || null,
        is_active: Boolean(formData.activa),
      };


      if (editingId) {
        await classService.update(editingId, payload);
      } else {
        await classService.create(payload);
      }

      resetForm();
      setShowForm(false);
      await fetchAll();
    } catch (e) {
      setToastError(e?.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // ============
  // Filters & stats
  // ============
  const clasesFiltradas = useMemo(() => {
    return clases.filter((c) => {
      const matchArea = filterArea === "Todas" || c.area === filterArea;
      const q = (filterBusqueda || "").toLowerCase();
      const matchBusqueda =
        (c.nombre || "").toLowerCase().includes(q) ||
        (c.instructor || "").toLowerCase().includes(q);
      return matchArea && matchBusqueda;
    });
  }, [clases, filterArea, filterBusqueda]);

  const statsActivas = clases.filter((c) => c.activa).length;
  const capacidadTotal = clases.reduce((sum, c) => sum + (c.capacidad || 0), 0);
  const inscritosTotal = clases.reduce((sum, c) => sum + (c.inscritos || 0), 0);
  const areaStats = {};
  clases.forEach((c) => {
    areaStats[c.area] = (areaStats[c.area] || 0) + 1;
  });

  // ============
  // UI
  // ============
  return (
    <div className="classes-management">
      {(toastError || error) && (
        <div className="toast-stack" role="status" aria-live="polite">
          {toastError && <div className="toast-error">{toastError}</div>}
          {error && <div className="toast-error">{error}</div>}
        </div>
      )}
      <div className="management-header">
        <h2>📚 Gestión de Clases</h2>
        {!isTeacher && (
          <button
            className="btn-add-class"
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            disabled={loading}
          >
            {showForm ? "✕ Cancelar" : "+ Crear Clase"}
          </button>
        )}
      </div>

      {error && (
        <div className="empty-state error-state">
          <p>
            <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
            <span>{error}</span>
          </p>
        </div>
      )}
      {loading && (
        <div className="empty-state">
          <p>
            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
            <span>Cargando...</span>
          </p>
        </div>
      )}

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
            <div className="stat-icon" style={{ fontSize: "20px" }}>{iconoArea[area]}</div>
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
          {(filterArea !== "Todas" || filterBusqueda) && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setFilterArea("Todas");
                setFilterBusqueda("");
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
              {areas.map((area) => (
                <option key={area} value={area}>
                  {iconoArea[area]} {area}
                </option>
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
      {showForm && !isTeacher && (
        <div className="form-container">
          <form className="classes-form">
            <h3>{editingId ? "Editar Clase" : "Nueva Clase"}</h3>

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

              {/* ✅ Instructor select */}
              <div className="form-group">
                <label>Instructor *</label>
                <select
                  value={formData.teacher_id}
                  onChange={handleTeacherChange}
                  required
                >
                  <option value="">Selecciona un instructor</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name || t.email || t.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Área *</label>
                  <select
                    name="group_id"
                    value={formData.group_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona un área</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
              </div>

              <div className="form-group">
                <label>Nivel</label>
                <select name="nivel" value={formData.nivel} onChange={handleInputChange}>
                  {niveles.map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {nivel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ✅ Horario + Hora (2 selects) */}
            <div className="form-row">
              <div className="form-group">
                <label>Horario (días) *</label>
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
                <label>Hora (inicio/fin) *</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <select
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                    style={{ flex: 1 }}
                  >
                    <option value="">Inicio</option>
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>

                  <select
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                    style={{ flex: 1 }}
                  >
                    <option value="">Fin</option>
                    {HOURS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
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
              <label className={`checkbox-label ${formData.activa ? "active" : "inactive"}`}>
                <input type="checkbox" name="activa" checked={formData.activa} onChange={handleInputChange} />
                <span className="checkbox-text">
                  {formData.activa ? "✓ Clase Activa" : "✗ Clase Inactiva"}
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-submit" onClick={handleSaveClase} disabled={loading}>
                {editingId ? "💾 Actualizar" : "✓ Crear"}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel} disabled={loading}>
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
            <p>📚 {filterBusqueda || filterArea !== "Todas" ? "No se encontraron clases con los filtros aplicados" : "No hay clases creadas aún"}</p>
            <small>Crea tu primera clase para comenzar</small>
          </div>
        ) : (
          clasesFiltradas.map((clase) => (
            <div key={clase.id} className={`class-card ${!clase.activa ? "inactive" : ""}`}>
              <div className="class-header">
                <div className="area-badge" style={{ backgroundColor: colorArea[clase.area] }}>
                  {iconoArea[clase.area]} {clase.area}
                </div>
                <span className={`status-badge ${clase.activa ? "active" : "inactive"}`}>
                  {clase.activa ? "✓ Activa" : "✗ Inactiva"}
                </span>
              </div>

              <h4 className={clase.activa ? "" : "inactive-text"}>{clase.nombre}</h4>

              <div className="class-info">
                <p className="info-item">👨‍🏫 <strong>{clase.instructor || "—"}</strong></p>
                <p className="info-item">📅 {clase.horario}</p>
                <p className="info-item">⏰ {toTimeRange(clase.start_time, clase.end_time)}</p>
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
                    style={{ width: `${clase.capacidad ? (clase.inscritos / clase.capacidad) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {clase.descripcion && <p className="class-description">{clase.descripcion}</p>}

              <div className="class-actions">
                <button
                  className="btn-edit"
                  onClick={() => navigate(`/classes/${clase.id}/students`)}
                  disabled={loading}
                >
                  👥 Estudiantes
                </button>

                {!isTeacher && (
                  <>
                    <button className="btn-edit" onClick={() => handleEditClase(clase)} title="Editar" disabled={loading}>
                      ✏️ Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteClase(clase)} title="Eliminar" disabled={loading}>
                      🗑️ Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>



      {/* Modal de Eliminación */}
      {deleteModal && !isTeacher && (
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
                  <p>Instructor: <strong>{deleteModal.instructor || "—"}</strong></p>
                  <p>Área: <strong>{deleteModal.area}</strong></p>
                  <p>Horario: <strong>{deleteModal.horario}</strong></p>
                </div>
              </div>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="delete-modal-actions">
              <button className="btn-delete-cancel" onClick={() => setDeleteModal(null)} disabled={loading}>
                ✕ Cancelar
              </button>
              <button className="btn-delete-confirm" onClick={confirmarDelete} disabled={loading}>
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


