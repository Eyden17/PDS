import React, { useState, useMemo, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import { mediaService } from '../../services/mediaService';
import '../styles/NewsManagement.css';

const NewsManagement = () => {
  const [news, setNews] = useState([
    { id: 1, titulo: 'Inauguración de nuevo aula de danza', descripcionCorta: 'Se ha inaugurado con éxito el nuevo aula de danza moderna con espejos de alta calidad', contenido: 'Nos complace anunciar la inauguración de nuestro nuevo aula de danza equipada con espejos de piso a techo, sistema de sonido profesional y piso especial para danza.', imagenPreview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23667eea" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3EEvento: Inauguración%3C/text%3E%3C/svg%3E', categoria: 'Evento', autor: 'Dirección', fechaCreacion: new Date('2025-12-20'), activa: true },
    { id: 2, titulo: 'Competencia anual de danzas 2025', descripcionCorta: 'Todos nuestros estudiantes están invitados a participar en este evento destacado', contenido: 'La competencia anual de danzas es uno de nuestros eventos más esperados. Este año tendremos categorías para todos los niveles de dificultad y grupos de edad.', imagenPreview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f39c12" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ECompetencia 2025%3C/text%3E%3C/svg%3E', categoria: 'Competencia', autor: 'Coordinador', fechaCreacion: new Date('2025-12-15'), activa: true },
    { id: 3, titulo: 'Cambios en horarios de clases', descripcionCorta: 'A partir del próximo mes habrá cambios en los horarios de todas las clases', contenido: 'Por favor revisar los nuevos horarios que entrarán en vigor a partir del 1 de enero de 2026. Los cambios se deben a la incorporación de nuevos horarios de turnos.', imagenPreview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%233498db" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3ECambios Horarios%3C/text%3E%3C/svg%3E', categoria: 'Anuncio', autor: 'Admin', fechaCreacion: new Date('2025-12-10'), activa: true },
    { id: 4, titulo: 'Masterclass con instructor internacional', descripcionCorta: 'Tendremos una masterclass especial con un instructor reconocido internacionalmente', contenido: 'No te pierdas esta oportunidad única de aprender técnicas avanzadas de un maestro internacional con más de 20 años de experiencia en danza contemporánea.', imagenPreview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%239b59b6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial"%3EMasterclass%3C/text%3E%3C/svg%3E', categoria: 'Workshop', autor: 'Instructor', fechaCreacion: new Date('2025-12-05'), activa: false },
  ]);
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
    imagenPreview: null,
    categoria: 'anuncio',
    autor: 'Admin',
    activa: true
  });

  const categorias = ['anuncio', 'recital', 'presentación', 'taller', 'otro'];
  const colorCategoria = {
    'anuncio': '#3498db',
    'recital': '#e74c3c',
    'presentación': '#f39c12',
    'taller': '#9b59b6',
    'otro': '#34495e'
  };
  const iconoCategoria = {
    'anuncio': '📢',
    'recital': '🎉',
    'presentación': '🏆',
    'taller': '📚',
    'otro': '📚'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  const handleAddNews = async () => {
    if (!formData.titulo || !formData.contenido) {
      alert('Campos obligatorios');
      return;
    }

    try {
      let coverMediaId = null;

      if (imageFile) {
        const media = await mediaService.uploadImage(imageFile, {
          section: 'news',
          title: formData.titulo
        });
        coverMediaId = media.id;
      }

      const payload = {
        title: formData.titulo,
        category: formData.categoria,
        content: formData.contenido,
        cover_media_id: coverMediaId,
        is_published: formData.activa
      };

      if (editingId) {
        await newsService.updateNews(editingId, payload);
      } else {
        await newsService.createNews(payload);
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      alert(err.message || 'Error al guardar');
    }
  };


  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcionCorta: '',
      contenido: '',
      imagenPreview: null,
      categoria: 'Anuncio',
      autor: 'Admin',
      activa: true
    });
    setEditingId(null);
  };

  const handleEditNews = (newsItem) => {
    setFormData(newsItem);
    setEditingId(newsItem.id);
    setShowForm(true);
  };

  const handleDeleteNews = (newsItem) => {
    setDeleteModal(newsItem);
  };

  const confirmarDelete = async () => {
    try {
      await newsService.deleteNews(deleteModal.id);

      setNews(prev =>
        prev.filter(n => n.id !== deleteModal.id)
      );

      setDeleteModal(null);
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
      const matchBusqueda = n.titulo.toLowerCase().includes(filterBusqueda.toLowerCase()) ||
                           n.descripcionCorta.toLowerCase().includes(filterBusqueda.toLowerCase());
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
        >
          {showForm ? '✕ Cancelar' : '+ Crear Noticia'}
        </button>
      </div>

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
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        imagenPreview: null
                      }))}
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
              >
                {editingId ? '💾 Actualizar' : '✓ Publicar'}
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
                  <img src={newsItem.imagenPreview} alt={newsItem.titulo} />
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
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteNews(newsItem)}
                    title="Eliminar"
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

export default NewsManagement;
