import React, { useState, useMemo, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import { mediaService } from '../../services/mediaService';
import '../styles/NewsManagement.css';

const NewsManagement = () => {
  const [news, setNews] = useState([]); // ✅ ahora viene del API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filterCategoria, setFilterCategoria] = useState('Todas');
  const [filterBusqueda, setFilterBusqueda] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descripcionCorta: '',
    contenido: '',
    imagenPreview: null,      // preview en UI (base64 o url)
    categoria: 'ANUNCIO',
    autor: 'Admin',           // solo UI
    activa: true
  });

  const categorias = ['ANUNCIO', 'RECITAL', 'PRESENTACIÓN', 'TALLER', 'OTRO'];

  const colorCategoria = {
    anuncio: '#3498db',
    recital: '#e74c3c',
    presentación: '#f39c12',
    taller: '#9b59b6',
    otro: '#34495e'
  };

  const iconoCategoria = {
    anuncio: '📢',
    recital: '🎉',
    presentación: '🏆',
    taller: '📚',
    otro: '📚'
  };

  // =========================
  // Helpers: categoría UI <-> DB
  // DB (según tu schema): 'ANUNCIO','RECITAL','PRESENTACIÓN','TALLER','OTRO'
  // =========================
  const toDbCategory = (uiCat) => {
    const c = (uiCat || '').toLowerCase();
    if (c === 'anuncio') return 'ANUNCIO';
    if (c === 'recital') return 'RECITAL';
    if (c === 'presentación' || c === 'presentacion') return 'PRESENTACIÓN';
    if (c === 'taller') return 'TALLER';
    return 'OTRO';
  };

  const fromDbCategory = (dbCat) => {
    const c = (dbCat || '').toUpperCase();
    if (c === 'ANUNCIO') return 'ANUNCIO';
    if (c === 'RECITAL') return 'RECITAL';
    if (c === 'PRESENTACIÓN' || c === 'PRESENTACION') return 'PRESENTACIÓN';
    if (c === 'TALLER') return 'TALLER';
    return 'OTRO';
  };

  // =========================
  // Cargar noticias desde API
  // =========================
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await newsService.list();
      const rows = res?.data ?? res ?? [];

      const mapped = rows.map((n) => {
        const catUpper = (n.category ?? 'OTRO').toUpperCase();

        // DB->UI (lowercase)
        const catLower =
          catUpper === 'ANUNCIO' ? 'ANUNCIO' :
          catUpper === 'RECITAL' ? 'RECITAL' :
          (catUpper === 'PRESENTACIÓN' || catUpper === 'PRESENTACION') ? 'PRESENTACIÓN' :
          catUpper === 'TALLER' ? 'TALLER' :
          'OTRO';
        return {
          id: n.id,
          titulo: n.title ?? '',
          descripcionCorta: n.short_description ?? (n.content ? String(n.content).slice(0, 140) : ''),
          contenido: n.content ?? '',

          // ✅ AQUÍ estaba el problema (tu API manda cover_url)
          imagenPreview: n.cover_url ?? n.cover_media_url ?? null,

          cover_media_id: n.cover_media_id ?? null,

          // ✅ categoría UI en minúsculas como tu diseño original
          categoria: catLower,

          autor: n.created_by_name ?? 'Admin',
          fechaCreacion: n.created_at ?? new Date(),
          activa: Boolean(n.is_published),
        };
      });

      setNews(mapped);
    } catch (e) {
      setError(e.message || 'Error cargando noticias');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        imagenPreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcionCorta: '',
      contenido: '',
      imagenPreview: null,
      categoria: 'ANUNCIO',
      autor: 'Admin',
      activa: true
    });
    setEditingId(null);
    setImageFile(null);
  };

  // =========================
  // Crear / Editar (API)
  // =========================
  const handleAddNews = async () => {
    if (!formData.titulo?.trim() || !formData.contenido?.trim()) {
      alert('Campos obligatorios');
      return;
    }

    try {
      let coverMediaId = null;
      let oldCoverId = null;

      // si estoy editando, tomo el cover actual (puede ser null)
      if (editingId) {
        const current = news.find(n => n.id === editingId);
        oldCoverId = current?.cover_media_id ?? null;
        coverMediaId = oldCoverId;
      }

      // ✅ Caso: el usuario quitó la imagen (dejó preview null) y NO subió una nueva
      const wantsRemoveCover =
        Boolean(editingId) && !imageFile && formData.imagenPreview === null;

      if (wantsRemoveCover) {
        coverMediaId = null; // se elimina el cover en la noticia
        if (oldCoverId) {
          try {
            await mediaService.deleteMedia(oldCoverId);
          } catch (e) {
            // si ya no existía en storage/BD, no rompas la edición
            console.warn('No se pudo borrar media vieja (ignorado):', e?.message || e);
          }
        }
      }

      // ✅ Caso: el usuario seleccionó una imagen nueva
      if (imageFile) {
        const media = await mediaService.uploadImage(imageFile, {
          section: 'news',
          title: formData.titulo
        });

        coverMediaId = media?.id ?? null;

        // borrar anterior solo si había
        if (oldCoverId) {
          try {
            await mediaService.deleteMedia(oldCoverId);
          } catch (e) {
            console.warn('No se pudo borrar media vieja (ignorado):', e?.message || e);
          }
        }
      }

      const payload = {
        title: formData.titulo.trim(),
        category: String(formData.categoria || 'ANUNCIO').toUpperCase(),
        short_description: formData.descripcionCorta.trim(),
        content: formData.contenido.trim(),
        cover_media_id: coverMediaId, // puede ser null
        is_published: Boolean(formData.activa),
      };

      if (editingId) {
        await newsService.update(editingId, payload);
      } else {
        await newsService.create(payload);
      }

      resetForm();
      setShowForm(false);
      await fetchNews();
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };



  const handleEditNews = (newsItem) => {
    setImageFile(null); // para que no re-subas si no cambian imagen
    setFormData({
      ...newsItem,
      // asegurá que el select use el valor correcto
      categoria: (newsItem.categoria ?? 'ANUNCIO'),
    });
    setEditingId(newsItem.id);
    setShowForm(true);
  };


  const handleDeleteNews = (newsItem) => {
    setDeleteModal(newsItem);
  };

  const confirmarDelete = async () => {
    try {
      // borrar noticia
      await newsService.remove(deleteModal.id);

      // opcional: borrar media asociada
      if (deleteModal.cover_media_id) {
        await mediaService.deleteMedia(deleteModal.cover_media_id);
      }

      setDeleteModal(null);
      await fetchNews();
    } catch (err) {
      alert(err.message || 'Error al eliminar la noticia');
    }
  };


  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const noticiasFiltradas = useMemo(() => {
    return news.filter(n => {
      const matchCategoria = filterCategoria === 'Todas' || n.categoria === filterCategoria;
      const busq = (filterBusqueda || '').toLowerCase();

      const matchBusqueda =
        (n.titulo || '').toLowerCase().includes(busq) ||
        (n.descripcionCorta || '').toLowerCase().includes(busq);

      return matchCategoria && matchBusqueda;
    });
  }, [news, filterCategoria, filterBusqueda]);

  const statsActivas = news.filter(n => n.activa).length;
  const categoriaStats = {};
  news.forEach(n => {
    categoriaStats[n.categoria] = (categoriaStats[n.categoria] || 0) + 1;
  });

  return (
    <div className="news-management">
      <div className="management-header">
        <h2>📰 Gestión de Noticias</h2>
        <button
          className="btn-add-news"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          disabled={loading}
        >
          {showForm ? '✕ Cancelar' : '+ Crear Noticia'}
        </button>
      </div>

      {/* Mensaje de error/cargando sin romper diseño */}
      {error && (
        <div className="empty-state">
          <p>⚠️ {error}</p>
        </div>
      )}
      {loading && (
        <div className="empty-state">
          <p>⏳ Cargando...</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total de Noticias</div>
            <div className="stat-value">{news.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Noticias Activas</div>
            <div className="stat-value">{statsActivas}</div>
          </div>
        </div>
        {Object.entries(categoriaStats).map(([cat, count]) => (
          <div key={cat} className="stat-card">
            <div className="stat-icon" style={{ fontSize: '20px' }}>{iconoCategoria[cat]}</div>
            <div className="stat-content">
              <div className="stat-label">{cat}</div>
              <div className="stat-value">{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>🔍 Filtros</h3>
          {(filterCategoria !== 'Todas' || filterBusqueda) && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setFilterCategoria('Todas');
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
              placeholder="Buscar por título o descripción..."
              value={filterBusqueda}
              onChange={(e) => setFilterBusqueda(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Categoría</label>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="filter-select"
            >
              <option value="Todas">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{iconoCategoria[cat]} {cat}</option>
              ))}
            </select>
          </div>
        </div>
        {noticiasFiltradas.length > 0 && (
          <div className="filters-result">
            Mostrando {noticiasFiltradas.length} de {news.length} noticias
          </div>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-container">
          <form className="news-form">
            <h3>{editingId ? 'Editar Noticia' : 'Nueva Noticia'}</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Título de la noticia"
                  maxLength="100"
                  required
                />
                <small>{formData.titulo.length}/100</small>
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Descripción corta *</label>
                <input
                  type="text"
                  name="descripcionCorta"
                  value={formData.descripcionCorta}
                  onChange={handleInputChange}
                  placeholder="Resumen breve de la noticia"
                  maxLength="150"
                  required
                />
                <small>{formData.descripcionCorta.length}/150</small>
              </div>

              <div className="form-group">
                <label>Autor *</label>
                <input
                  type="text"
                  name="autor"
                  value={formData.autor}
                  onChange={handleInputChange}
                  placeholder="Quién publica esta noticia"
                  maxLength="50"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contenido *</label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleInputChange}
                placeholder="Contenido completo de la noticia..."
                rows="4"
                maxLength="1000"
                required
              />
              <small>{formData.contenido.length}/1000</small>
            </div>

            <div className="form-group">
              <label>Imagen</label>
              <div className="image-upload-area">
                {formData.imagenPreview ? (
                  <div className="image-preview">
                    <img src={formData.imagenPreview} alt="Preview" />
                    <button
                      type="button"
                      className="btn-remove-image"
                      onClick={() => {
                        // permite "cambiar" imagen
                        setFormData(prev => ({ ...prev, imagenPreview: null }));
                        setImageFile(null);
                      }}
                    >
                      Cambiar imagen
                    </button>
                  </div>
                ) : (
                  <label className="image-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-placeholder">
                      <span className="upload-icon">🖼️</span>
                      <p>Haz clic para cargar una imagen</p>
                      <small>JPG, PNG, GIF (máx. 5MB)</small>
                    </div>
                  </label>
                )}
              </div>
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
                  {formData.activa ? '✓ Noticia Activa' : '✗ Noticia Inactiva'}
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-submit"
                onClick={handleAddNews}
                disabled={loading}
              >
                {editingId ? '💾 Actualizar' : '✓ Publicar'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                ✕ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de Noticias */}
      <div className="news-grid-container">
        {noticiasFiltradas.length === 0 ? (
          <div className="empty-state">
            <p>📰 {filterBusqueda || filterCategoria !== 'Todas' ? 'No se encontraron noticias con los filtros aplicados' : 'No hay noticias creadas aún'}</p>
            <small>Crea tu primera noticia para comenzar</small>
          </div>
        ) : (
          noticiasFiltradas.map(newsItem => (
            <div
              key={newsItem.id}
              className={`news-card ${!newsItem.activa ? 'inactive' : ''}`}
            >
              {newsItem.imagenPreview && (
                <div className="news-image">
<img
  src={newsItem.imagenPreview}
  alt={newsItem.titulo}
  onError={(e) => {
    console.error('No cargó la imagen:', newsItem.imagenPreview);
    e.currentTarget.style.display = 'none';
  }}
/>
                  <span
                    className="category-badge"
                    style={{ backgroundColor: colorCategoria[newsItem.categoria] }}
                  >
                    {iconoCategoria[newsItem.categoria]} {newsItem.categoria}
                  </span>
                </div>
              )}
              <div className="news-card-content">
                <div className="news-header">
                  <h4 className={newsItem.activa ? '' : 'inactive-text'}>{newsItem.titulo}</h4>
                  <span className={`status-badge ${newsItem.activa ? 'active' : 'inactive'}`}>
                    {newsItem.activa ? '✓ Activa' : '✗ Inactiva'}
                  </span>
                </div>

                <p className="news-description">{newsItem.descripcionCorta}</p>

                <div className="news-meta">
                  <span className="meta-item">👤 {newsItem.autor}</span>
                  <span className="meta-item">📅 {formatDate(newsItem.fechaCreacion)}</span>
                </div>

                <div className="news-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditNews(newsItem)}
                    title="Editar"
                    disabled={loading}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteNews(newsItem)}
                    title="Eliminar"
                    disabled={loading}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
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
              <h3>Eliminar Noticia</h3>
            </div>
            <div className="delete-modal-body">
              <p>¿Estás seguro de que deseas eliminar esta noticia?</p>
              <div className="news-preview">
                {deleteModal.imagenPreview && (
                  <img src={deleteModal.imagenPreview} alt="preview" className="preview-img" />
                )}
                <div className="preview-info">
                  <h5>{deleteModal.titulo}</h5>
                  <p>{deleteModal.descripcionCorta}</p>
                  <span
                    className="category-badge-small"
                    style={{ backgroundColor: colorCategoria[deleteModal.categoria] }}
                  >
                    {iconoCategoria[deleteModal.categoria]} {deleteModal.categoria}
                  </span>
                </div>
              </div>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="delete-modal-actions">
              <button
                className="btn-delete-cancel"
                onClick={() => setDeleteModal(null)}
                disabled={loading}
              >
                ✕ Cancelar
              </button>
              <button
                className="btn-delete-confirm"
                onClick={confirmarDelete}
                disabled={loading}
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

export default NewsManagement;
