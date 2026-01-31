
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import '../styles/TestimonialsPage.css';
import { testimonialsService } from '../../services/testimonialsService';


const TestimonialsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || '';
  const isTeacher = String(role).toUpperCase() === 'TEACHER';
const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const a = parts[0]?.[0] ?? '';
  const b = (parts.length > 1 ? parts[parts.length - 1][0] : '') ?? '';
  return (a + b).toUpperCase();
};

  // Estado principal
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterRelation, setFilterRelation] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ initials: '', name: '', relation: '', text: '', rating: 5 });
  const [toastError, setToastError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await testimonialsService.list();
      // Axios: res.data; Fetch wrapper: res directly
      const rows = res?.data ?? res ?? [];
      // Normaliza campos desde DB -> UI
      const normalized = (rows || []).map((r) => ({
        id: r.id,
        initials: getInitials(r.author_name),
        name: r.author_name,
        relation: r.author_role || '',
        text: r.text,
        rating: r.rating,
        is_published: r.is_published ?? true,
        created_at: r.created_at,
      }));
      setTestimonials(normalized);
    } catch (err) {
      console.error(err);
      setToastError('No se pudieron cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isTeacher) {
      navigate('/teacher', { replace: true });
      return;
    }
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTeacher, navigate]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) {
      setToastError("Nombre y testimonio son obligatorios");
      return;
    }

    const payload = {
      author_name: form.name,
      author_role: form.relation,
      text: form.text,
      rating: Number(form.rating || 5),
      is_published: true, // se publica directo (solo admin crea)
    };

    try {
      setLoading(true);
      if (editing) {
        const res = await testimonialsService.update(editing, payload);
        const updated = res?.data ?? res;
        setTestimonials(testimonials.map(t =>
          t.id === editing
            ? {
                ...t,
                initials: getInitials(updated?.author_name ?? form.name),
                name: updated?.author_name ?? form.name,
                relation: updated?.author_role ?? form.relation,
                text: updated?.text ?? form.text,
                rating: updated?.rating ?? Number(form.rating || 5),
              }
            : t
        ));
      } else {
        const res = await testimonialsService.create(payload);
        const created = res?.data ?? res;
        setTestimonials([
          ...testimonials,
          {
            id: created.id,
            initials: getInitials(created?.author_name ?? form.name),
            name: created?.author_name ?? form.name,
            relation: created?.author_role ?? form.relation,
            text: created?.text ?? form.text,
            rating: created?.rating ?? Number(form.rating || 5),
            is_published: created?.is_published ?? true,
            created_at: created?.created_at,
          }
        ]);
      }

      setShowForm(false);
      setEditing(null);
      setToastError("");
      // reset
      setForm({ initials: '', name: '', relation: '', text: '', rating: 5 });
    } catch (err) {
      console.error(err);
      setToastError("No se pudo guardar la reseña");
    } finally {
      setLoading(false);
    }
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
          <h1 className="admin-title">Panel Administrativo {loading ? '· Cargando…' : ''}</h1>
          <p className="admin-header-sub">Gestión de Arte Brilla</p>
        </div>
      </div>
      <div className="testimonials-admin-panel">
        {toastError && (
          <div className="toast-stack" role="status" aria-live="polite">
            <div className="toast-error">{toastError}</div>
          </div>
        )}
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
