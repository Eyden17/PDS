
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TestimonialsPage.css';

// Datos de ejemplo
const initialTestimonials = [
  { id: 1, initials: 'MG', name: 'María García', relation: 'Madre de estudiante Babies', text: 'Mi hijo ha mejorado mucho en confianza desde que comenzó en Arte Brilla. Los instructores son muy dedicados.', rating: 5 },
  { id: 2, initials: 'JL', name: 'Juan López', relation: 'Padre de estudiantes Minies', text: 'La metodología profesional y el ambiente amigable hacen que mis hijas disfruten venir a clases.', rating: 5 },
  { id: 3, initials: 'CR', name: 'Carmen Rodríguez', relation: 'Madre de estudiante Artes Proféticas', text: 'Estoy muy agradecida con el equipo docente. Han ayudado a mis hijas a encontrar su pasión por la danza.', rating: 5 },
  { id: 4, initials: 'EM', name: 'Elena Martínez', relation: 'Abuela de estudiante', text: 'Los eventos que organizan son increíbles. El nivel profesional es realmente notorio.', rating: 5 },
];

const TestimonialsPage = () => {
  const navigate = useNavigate();
  // Estado principal
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [filterName, setFilterName] = useState("");
  const [filterRelation, setFilterRelation] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ initials: '', name: '', relation: '', text: '', rating: 5 });
  const [toastError, setToastError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Filtros
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(t => {
      const matchName = !filterName || t.name.toLowerCase().includes(filterName.toLowerCase());
      const matchRelation = !filterRelation || t.relation.toLowerCase().includes(filterRelation.toLowerCase());
      const matchRating = filterRating === "all" || t.rating === Number(filterRating);
      return matchName && matchRelation && matchRating;
    });
  }, [testimonials, filterName, filterRelation, filterRating]);

  // Acciones CRUD locales
  const handleEdit = (t) => {
    setEditing(t.id);
    setForm({ ...t });
    setShowForm(true);
  };
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    setTestimonials(testimonials.filter(t => t.id !== deleteId));
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };
  const handleAdd = () => {
    setEditing(null);
    setForm({ initials: '', name: '', relation: '', text: '', rating: 5 });
    setShowForm(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleRating = (r) => {
    setForm(f => ({ ...f, rating: r }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.text) {
      setToastError("Nombre y testimonio son obligatorios");
      return;
    }
    if (editing) {
      setTestimonials(testimonials.map(t => t.id === editing ? { ...form, id: editing } : t));
    } else {
      setTestimonials([...testimonials, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
    setEditing(null);
    setToastError("");
  };

  // UI principal
  return (
    <div className="testimonials-admin-bg">
      {/* Botón fuera del panel blanco, fijo arriba a la izquierda */}
      <button className="btn-back btn-back-fixed" onClick={() => navigate('/dashboard')}>
        ← Volver al Panel Principal
      </button>
      <div className="admin-header-fixed">
        <div className="admin-title-block">
          <h1 className="admin-title">Panel Administrativo</h1>
          <p className="admin-header-sub">Gestión de Arte Brilla</p>
        </div>
      </div>
      <div className="testimonials-admin-panel">
        {toastError && <div className="toast-error">{toastError}</div>}
        <div className="testimonials-header">
          <div>
            <h2>Gestión de Testimonios</h2>
            <p className="header-subtitle">Agrega, edita y filtra testimonios de estudiantes y familiares</p>
          </div>
          <button className="add-btn" onClick={handleAdd}>+ Agregar Testimonio</button>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-header">
            <h3>Filtros de búsqueda</h3>
          </div>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Por nombre</label>
              <input type="text" value={filterName} onChange={e => setFilterName(e.target.value)} placeholder="Buscar por nombre..." />
            </div>
            <div className="filter-group">
              <label>Por relación</label>
              <input type="text" value={filterRelation} onChange={e => setFilterRelation(e.target.value)} placeholder="Ej: madre, padre..." />
            </div>
            <div className="filter-group">
              <label>Por calificación</label>
              <select value={filterRating} onChange={e => setFilterRating(e.target.value)}>
                <option value="all">Todas</option>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} estrellas</option>)}
              </select>
            </div>
            <button className="btn-reset-filters" onClick={() => { setFilterName(""); setFilterRelation(""); setFilterRating("all"); }}>Limpiar Filtros</button>
          </div>
          <p className="filters-result">Mostrando {filteredTestimonials.length} de {testimonials.length} testimonios</p>
        </div>

        {/* Cards de testimonios */}
        <div className="testimonials-cards">
          {filteredTestimonials.length === 0 ? (
            <div className="empty-state">
              <p>No hay testimonios que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            filteredTestimonials.map(t => (
              <div className="testimonial-card" key={t.id}>
                <div className="testimonial-avatar">{t.initials}</div>
                <div className="testimonial-text">{t.text}</div>
                <div className="testimonial-rating">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <hr className="testimonial-divider" />
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-relation">{t.relation}</div>
                <div className="testimonial-actions">
                  <button onClick={() => handleEdit(t)} className="edit-btn">Editar</button>
                  <button onClick={() => handleDelete(t.id)} className="delete-btn">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de formulario */}
        {showForm && (
          <div className="testimonial-form-modal">
            <form className="testimonial-form testimonial-form-enhanced" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2 className="form-title">{editing ? 'Editar Testimonio' : 'Agregar Testimonio'}</h2>
                <p className="form-instructions">Por favor, completa los campos para agregar un testimonio. Los campos marcados con * son obligatorios.</p>
              </div>
              <div className="form-fields-grid">
                <label>Iniciales*
                  <input name="initials" value={form.initials} maxLength={2} onChange={handleChange} required placeholder="Ej: MG" />
                </label>
                <label>Nombre completo*
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Ej: María García" />
                </label>
                <label>Relación
                  <input name="relation" value={form.relation} onChange={handleChange} placeholder="Ej: Madre de estudiante" />
                </label>
                <label>Testimonio*
                  <textarea name="text" value={form.text} onChange={handleChange} required placeholder="Escribe aquí el testimonio..." />
                </label>
                <label>Calificación
                  <div className="form-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={form.rating > i ? 'star selected' : 'star'}
                        onClick={() => handleRating(i + 1)}
                      >★</span>
                    ))}
                  </div>
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Guardar</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {deleteId !== null && (
          <div className="testimonial-form-modal">
            <div className="testimonial-form" style={{textAlign: 'center'}}>
              <h2 style={{color: '#dc2626', marginBottom: '1rem'}}>¿Eliminar testimonio?</h2>
              <p>¿Estás seguro de que deseas eliminar este testimonio? Esta acción no se puede deshacer.</p>
              <div className="form-actions">
                <button className="save-btn" style={{background: '#dc2626', maxWidth: 180}} onClick={confirmDelete} type="button">Sí, eliminar</button>
                <button className="cancel-btn" onClick={cancelDelete} type="button">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
