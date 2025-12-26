import React, { useState, useEffect, useMemo } from 'react';
import '../styles/CommunicationManagement.css';

const CommunicationManagement = () => {
  // Datos de ejemplo
  const getDatosEjemplo = () => [
    { 
      id: 1, 
      titulo: 'Recordatorio: Pago de mensualidad', 
      tipo: 'Recordatorio', 
      destinatarios: 'Todos', 
      contenido: 'Les recordamos que el pago de la mensualidad vence el 25 del mes. Por favor realicen el pago a tiempo para evitar inconvenientes.', 
      fechaEnvio: '2025-12-20', 
      leido: 18, 
      noLeido: 7, 
      estado: 'Enviado' 
    },
    { 
      id: 2, 
      titulo: 'Nuevo horario disponible', 
      tipo: 'Anuncio', 
      destinatarios: 'Babies, Minies', 
      contenido: 'Se abre nueva clase de danza contemporánea los viernes a las 4:00 PM. ¡Inscríbete ahora en la recepción!', 
      fechaEnvio: '2025-12-18', 
      leido: 25, 
      noLeido: 0, 
      estado: 'Enviado' 
    },
    { 
      id: 3, 
      titulo: 'Inscripción para competencia anual', 
      tipo: 'Evento', 
      destinatarios: 'Minies', 
      contenido: 'Las inscripciones para la competencia anual están abiertas hasta el 31 de enero. Costo: $50 por participante. Cupos limitados.', 
      fechaEnvio: '2025-12-15', 
      leido: 22, 
      noLeido: 3, 
      estado: 'Enviado' 
    },
    { 
      id: 4, 
      titulo: 'Cambio de horario - Clase de Ballet', 
      tipo: 'Cambio', 
      destinatarios: 'Minies', 
      contenido: 'La clase de ballet clásico se trasladará a las 6:00 PM a partir de enero. El nuevo aula será la sala 3 en el segundo piso.', 
      fechaEnvio: '2025-12-10', 
      leido: 20, 
      noLeido: 0, 
      estado: 'Enviado' 
    },
  ];

  // Estados
  const [mensajes, setMensajes] = useState(() => {
    const mensajesGuardados = localStorage.getItem('mensajes_comunicacion');
    if (mensajesGuardados) {
      try {
        return JSON.parse(mensajesGuardados);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        return getDatosEjemplo();
      }
    }
    return getDatosEjemplo();
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterBusqueda, setFilterBusqueda] = useState('');
  const [sendModal, setSendModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'Anuncio',
    usuariosSeleccionados: [],
    contenido: ''
  });
  const [showRecipientSelector, setShowRecipientSelector] = useState(false);
  const [expandedGroupsForm, setExpandedGroupsForm] = useState({});
  const [searchUsuarios, setSearchUsuarios] = useState('');

  // Configuración de tipos
  const tipos = ['Anuncio', 'Recordatorio', 'Evento', 'Cambio', 'Otros'];
  
  // Información detallada de grupos con usuarios
  const gruposInfo = {
    'Todos': { 
      cantidad: 25, 
      color: '#667eea',
      subgrupos: ['Babies (8)', 'Minies (10)', 'Artes Proféticas (7)']
    },
    'Babies': { 
      cantidad: 8, 
      color: '#ec4899',
      usuarios: ['Ana García', 'Bruno López', 'Carla Pérez', 'David Ruiz', 'Emma Torres', 'Fátima García', 'Gabriel Martínez', 'Helena Sánchez']
    },
    'Minies': { 
      cantidad: 10, 
      color: '#8b5cf6',
      usuarios: ['Isabela Martín', 'Jorge Díaz', 'Karen López', 'Luis Fernández', 'Marcos García', 'Natalia Rodríguez', 'Óscar Pérez', 'Paula González', 'Rodrigo Núñez', 'Sandra Flores']
    },
    'Artes Proféticas': { 
      cantidad: 7, 
      color: '#f4a460',
      usuarios: ['Tomás Rivera', 'Valeria Rojas', 'Walter Mendoza', 'Ximena Gómez', 'Yasmin Herrera', 'Zoe Castillo', 'Andrés Reyes']
    }
  };

  const colorTipo = {
    'Anuncio': '#3498db',
    'Recordatorio': '#f39c12',
    'Evento': '#e74c3c',
    'Cambio': '#9b59b6',
    'Otros': '#95a5a6'
  };
  const iconoTipo = {
    'Anuncio': '📢',
    'Recordatorio': '🔔',
    'Evento': '🎉',
    'Cambio': '⚡',
    'Otros': '📝'
  };

  // Guardar mensajes en localStorage cuando cambian
  useEffect(() => {
    if (mensajes.length > 0) {
      localStorage.setItem('mensajes_comunicacion', JSON.stringify(mensajes));
    }
  }, [mensajes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulario
  const validateForm = () => {
    if (!formData.titulo.trim()) {
      alert('El asunto es obligatorio');
      return false;
    }
    if (formData.titulo.trim().length < 5) {
      alert('El asunto debe tener al menos 5 caracteres');
      return false;
    }
    if (!formData.contenido.trim()) {
      alert('El mensaje es obligatorio');
      return false;
    }
    if (formData.contenido.trim().length < 10) {
      alert('El mensaje debe tener al menos 10 caracteres');
      return false;
    }
    if (formData.usuariosSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un usuario o grupo');
      return false;
    }
    return true;
  };

  // Mostrar modal de confirmación antes de enviar
  const handleShowSendModal = () => {
    if (!validateForm()) return;
    setSendModal(true);
  };

  // Enviar mensaje (simular con delay)
  const handleConfirmSend = async () => {
    setIsLoading(true);
    
    // Simular envío con delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (editingId) {
      setMensajes(mensajes.map(m =>
        m.id === editingId
          ? { ...m, ...formData }
          : m
      ));
    } else {
      const nuevoMensaje = {
        ...formData,
        id: Math.max(...mensajes.map(m => m.id), 0) + 1,
        fechaEnvio: new Date().toISOString().split('T')[0],
        leido: 0,
        noLeido: formData.usuariosSeleccionados.length,
        estado: 'Enviado',
        porcentajeEntrega: 100
      };
      setMensajes([nuevoMensaje, ...mensajes]);
    }

    resetForm();
    setShowForm(false);
    setSendModal(false);
    setIsLoading(false);
  };

  // Alternar expansión de grupos en el formulario
  const toggleGroupExpandedForm = (groupName) => {
    setExpandedGroupsForm(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Alternar expansión de grupos en el modal
  const toggleGroupExpanded = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Alternar selección de usuario
  const toggleUserSelection = (usuario) => {
    setFormData(prev => ({
      ...prev,
      usuariosSeleccionados: prev.usuariosSeleccionados.includes(usuario)
        ? prev.usuariosSeleccionados.filter(u => u !== usuario)
        : [...prev.usuariosSeleccionados, usuario]
    }));
  };

  // Seleccionar todos los usuarios de un grupo
  const selectAllUsersInGroup = (grupo) => {
    const usuariosDelGrupo = gruposInfo[grupo].usuarios;
    const todosSeleccionados = usuariosDelGrupo.every(u => formData.usuariosSeleccionados.includes(u));
    
    setFormData(prev => ({
      ...prev,
      usuariosSeleccionados: todosSeleccionados
        ? prev.usuariosSeleccionados.filter(u => !usuariosDelGrupo.includes(u))
        : [...new Set([...prev.usuariosSeleccionados, ...usuariosDelGrupo])]
    }));
  };
  // Contar usuarios seleccionados de un grupo
  const contarSeleccionadosDelGrupo = (grupo) => {
    const usuariosDelGrupo = gruposInfo[grupo].usuarios;
    return usuariosDelGrupo.filter(u => formData.usuariosSeleccionados.includes(u)).length;
  };

  // Filtrar usuarios según la búsqueda
  const filtrarUsuarios = (usuarios) => {
    if (!searchUsuarios.trim()) return usuarios;
    return usuarios.filter(usuario =>
      usuario.toLowerCase().includes(searchUsuarios.toLowerCase())
    );
  };

  // Generar texto del desglose de usuarios seleccionados por grupo
  const generarDesgloseUsuarios = () => {
    const grupos = ['Babies', 'Minies', 'Artes Proféticas'];
    const desglose = {};

    grupos.forEach(grupo => {
      const seleccionadosDelGrupo = contarSeleccionadosDelGrupo(grupo);
      const totalDelGrupo = gruposInfo[grupo].cantidad;
      desglose[grupo] = { seleccionados: seleccionadosDelGrupo, total: totalDelGrupo };
    });

    // Si están todos seleccionados
    const totalUsuarios = grupos.reduce((sum, grupo) => sum + gruposInfo[grupo].cantidad, 0);
    if (formData.usuariosSeleccionados.length === totalUsuarios) {
      return 'Todos los usuarios';
    }

    // Generar desglose
    const desgloseTexto = grupos
      .filter(grupo => desglose[grupo].seleccionados > 0)
      .map(grupo => {
        const sel = desglose[grupo].seleccionados;
        const tot = desglose[grupo].total;
        return sel === tot ? `${grupo} (${sel})` : `${grupo} (${sel}/${tot})`;
      })
      .join(' • ');

    return desgloseTexto || 'Sin seleccionar';
  };

  // Generar desglose de usuarios para mostrar en la lista
  const generarDesgloseParaLista = (usuariosArray) => {
    if (!usuariosArray || usuariosArray.length === 0) return 'Sin destinatarios';
    
    const grupos = ['Babies', 'Minies', 'Artes Proféticas'];
    const desglose = {};

    grupos.forEach(grupo => {
      const usuariosDelGrupoSeleccionados = gruposInfo[grupo].usuarios.filter(u =>
        usuariosArray.includes(u)
      );
      desglose[grupo] = {
        seleccionados: usuariosDelGrupoSeleccionados.length,
        total: gruposInfo[grupo].cantidad
      };
    });

    // Si están todos seleccionados
    const totalUsuarios = grupos.reduce((sum, grupo) => sum + gruposInfo[grupo].cantidad, 0);
    if (usuariosArray.length === totalUsuarios) {
      return 'Todos';
    }

    // Generar desglose
    const desgloseTexto = grupos
      .filter(grupo => desglose[grupo].seleccionados > 0)
      .map(grupo => {
        const sel = desglose[grupo].seleccionados;
        const tot = desglose[grupo].total;
        return sel === tot ? `${grupo} (${sel})` : `${grupo} (${sel}/${tot})`;
      })
      .join(', ');

    return desgloseTexto || 'Sin destinatarios';
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      tipo: 'Anuncio',
      usuariosSeleccionados: [],
      contenido: ''
    });
    setEditingId(null);
    setShowRecipientSelector(false);
    setExpandedGroupsForm({});
    setSearchUsuarios('');
  };

  const handleEditMessage = (mensaje) => {
    setFormData({
      titulo: mensaje.titulo,
      tipo: mensaje.tipo,
      usuariosSeleccionados: mensaje.usuariosSeleccionados || [],
      contenido: mensaje.contenido
    });
    setEditingId(mensaje.id);
    setShowForm(true);
    setShowRecipientSelector(true);
  };

  const handleDeleteMessage = (mensaje) => {
    setDeleteModal(mensaje);
  };

  const confirmarDelete = () => {
    setMensajes(mensajes.filter(m => m.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const mensajesFiltrados = useMemo(() => {
    return mensajes.filter(m => {
      const matchTipo = filterTipo === 'Todos' || m.tipo === filterTipo;
      const matchBusqueda = m.titulo.toLowerCase().includes(filterBusqueda.toLowerCase());
      return matchTipo && matchBusqueda;
    });
  }, [mensajes, filterTipo, filterBusqueda]);

  const totalMensajes = mensajes.length;
  const totalLeidos = mensajes.reduce((sum, m) => sum + m.leido, 0);
  const totalNoLeidos = mensajes.reduce((sum, m) => sum + m.noLeido, 0);
  const tipoStats = {};
  mensajes.forEach(m => {
    tipoStats[m.tipo] = (tipoStats[m.tipo] || 0) + 1;
  });

  const formatDate = (dateString) => {
    const fecha = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="communication-management">
      <div className="management-header">
        <h2>📢 Gestión de Comunicación</h2>
        <button
          className="btn-send-message"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Nuevo Mensaje'}
        </button>
      </div>

      {/* Estadísticas */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <div className="stat-label">Total Enviados</div>
            <div className="stat-value">{totalMensajes}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Leídos</div>
            <div className="stat-value">{totalLeidos}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-content">
            <div className="stat-label">No Leídos</div>
            <div className="stat-value">{totalNoLeidos}</div>
          </div>
        </div>
        {Object.entries(tipoStats).map(([tipo, count]) => (
          <div key={tipo} className="stat-card">
            <div className="stat-icon" style={{ fontSize: '20px' }}>{iconoTipo[tipo]}</div>
            <div className="stat-content">
              <div className="stat-label">{tipo}</div>
              <div className="stat-value">{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>🔍 Filtros</h3>
          {(filterTipo !== 'Todos' || filterBusqueda) && (
            <button
              className="btn-reset-filters"
              onClick={() => {
                setFilterTipo('Todos');
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
              placeholder="Buscar por título..."
              value={filterBusqueda}
              onChange={(e) => setFilterBusqueda(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Tipo de Mensaje</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="filter-select"
            >
              <option value="Todos">Todos los tipos</option>
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>{iconoTipo[tipo]} {tipo}</option>
              ))}
            </select>
          </div>
        </div>
        {mensajesFiltrados.length > 0 && (
          <div className="filters-result">
            Mostrando {mensajesFiltrados.length} de {mensajes.length} mensajes
          </div>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-container">
          <form className="communication-form">
            <h3>{editingId ? 'Editar Mensaje' : 'Nuevo Mensaje'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Asunto *</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ej: Recordatorio de pago"
                  maxLength="100"
                  required
                />
                <small>{formData.titulo.length}/100</small>
              </div>

              <div className="form-group">
                <label>Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  {tipos.map(tipo => (
                    <option key={tipo} value={tipo}>{iconoTipo[tipo]} {tipo}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Enviar a *</label>
              <button
                type="button"
                className="btn-toggle-recipients"
                onClick={() => setShowRecipientSelector(!showRecipientSelector)}
              >
                {showRecipientSelector ? '▼' : '▶'} Seleccionar Destinatarios ({formData.usuariosSeleccionados.length} usuarios)
              </button>
              
              {showRecipientSelector && (
                <div className="recipients-selector-form">
                  <div className="search-usuarios-container">
                    <input
                      type="text"
                      placeholder="🔍 Buscar usuario por nombre..."
                      value={searchUsuarios}
                      onChange={(e) => setSearchUsuarios(e.target.value)}
                      className="search-usuarios-input"
                    />
                  </div>
                  
                  {['Babies', 'Minies', 'Artes Proféticas'].map(grupo => {
                    const usuariosFiltrados = filtrarUsuarios(gruposInfo[grupo].usuarios);
                    const seleccionadosDelGrupo = contarSeleccionadosDelGrupo(grupo);
                    
                    return (
                      <div key={grupo} className="accordion-item">
                        <button
                          type="button"
                          className="accordion-header"
                          onClick={() => toggleGroupExpandedForm(grupo)}
                        >
                          <span className="accordion-toggle">
                            {expandedGroupsForm[grupo] ? '▼' : '▶'}
                          </span>
                          <input
                            type="checkbox"
                            checked={gruposInfo[grupo].usuarios.every(u => formData.usuariosSeleccionados.includes(u))}
                            onChange={() => selectAllUsersInGroup(grupo)}
                            className="group-checkbox"
                          />
                          <span className="accordion-title">{grupo}</span>
                          <span className="accordion-count">
                            {seleccionadosDelGrupo}/{gruposInfo[grupo].cantidad}
                          </span>
                        </button>
                        {expandedGroupsForm[grupo] && (
                          <div className="accordion-content">
                            {usuariosFiltrados.length > 0 ? (
                              usuariosFiltrados.map((usuario, idx) => (
                                <label key={idx} className="user-checkbox-label">
                                  <input
                                    type="checkbox"
                                    checked={formData.usuariosSeleccionados.includes(usuario)}
                                    onChange={() => toggleUserSelection(usuario)}
                                    className="user-checkbox"
                                  />
                                  <span>{usuario}</span>
                                </label>
                              ))
                            ) : (
                              <div className="no-results">No se encontraron usuarios</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {formData.usuariosSeleccionados.length > 0 && (
                <div className="selected-users-preview">
                  <strong>📌 Usuarios seleccionados:</strong> {generarDesgloseUsuarios()}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Mensaje *</label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleInputChange}
                placeholder="Escribe el contenido del mensaje..."
                rows="5"
                maxLength="1000"
                required
              />
              <small>{formData.contenido.length}/1000</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-submit"
                onClick={handleShowSendModal}
                disabled={isLoading}
              >
                {editingId ? '💾 Actualizar' : isLoading ? '⏳ Enviando...' : '✉️ Enviar'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isLoading}
              >
                ✕ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Mensajes */}
      <div className="messages-container">
        {mensajesFiltrados.length === 0 ? (
          <div className="empty-state">
            <p>📨 {filterBusqueda || filterTipo !== 'Todos' ? 'No se encontraron mensajes con los filtros aplicados' : 'No hay mensajes enviados aún'}</p>
            <small>Envía tu primer mensaje para comenzar</small>
          </div>
        ) : (
          <div className="messages-list">
            {mensajesFiltrados.map(mensaje => (
              <div key={mensaje.id} className="message-item">
                <div className="message-header">
                  <div className="message-type-badge" style={{ backgroundColor: colorTipo[mensaje.tipo] }}>
                    {iconoTipo[mensaje.tipo]} {mensaje.tipo}
                  </div>
                  <span className="message-date">{formatDate(mensaje.fechaEnvio)}</span>
                </div>

                <h4 className="message-title">{mensaje.titulo}</h4>

                <p className="message-content">{mensaje.contenido}</p>

                <div className="message-info">
                  <div className="info-group">
                    <span className="label">Enviado a:</span>
                    <div className="recipient-badge">
                      <span className="recipient-badge-text">{generarDesgloseParaLista(mensaje.usuariosSeleccionados)}</span>
                      <span className="recipient-badge-count">({mensaje.usuariosSeleccionados?.length || 0})</span>
                    </div>
                  </div>
                  <div className="info-group">
                    <span className="label">Estado:</span>
                    <span className="value status">{mensaje.estado}</span>
                  </div>
                </div>

                <div className="engagement-bar">
                  <div className="engagement-stat">
                    <span className="stat-label">Leído</span>
                    <div className="mini-progress">
                      <div 
                        className="mini-progress-fill read"
                        style={{ width: `${(mensaje.leido / (mensaje.leido + mensaje.noLeido)) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="stat-count">{mensaje.leido}</span>
                  </div>
                  <div className="engagement-stat">
                    <span className="stat-label">No Leído</span>
                    <div className="mini-progress">
                      <div 
                        className="mini-progress-fill unread"
                        style={{ width: `${(mensaje.noLeido / (mensaje.leido + mensaje.noLeido)) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="stat-count">{mensaje.noLeido}</span>
                  </div>
                </div>

                <div className="message-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditMessage(mensaje)}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteMessage(mensaje)}
                    title="Eliminar"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Eliminación */}
      {deleteModal && (
        <div className="modal-overlay delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <span className="warning-icon">⚠️</span>
              <h3>Eliminar Mensaje</h3>
            </div>
            <div className="delete-modal-body">
              <p>¿Estás seguro de que deseas eliminar este mensaje?</p>
              <div className="message-preview">
                <div className="preview-info">
                  <h5>{deleteModal.titulo}</h5>
                  <p>Tipo: <strong>{deleteModal.tipo}</strong></p>
                  <p>Enviado a: <strong>{generarDesgloseParaLista(deleteModal.usuariosSeleccionados)}</strong></p>
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

      {/* Modal de Confirmación de Envío */}
      {sendModal && (
        <div className="modal-overlay send-modal-overlay">
          <div className="send-modal">
            <div className="send-modal-header">
              <span className="send-icon">📧</span>
              <h3>Confirmar Envío</h3>
            </div>
            <div className="send-modal-body">
              <div className="send-preview">
                <div className="preview-section">
                  <label>Asunto:</label>
                  <h4>{formData.titulo}</h4>
                </div>

                <div className="preview-section">
                  <label>Tipo:</label>
                  <div className="preview-badge" style={{ backgroundColor: colorTipo[formData.tipo] }}>
                    {iconoTipo[formData.tipo]} {formData.tipo}
                  </div>
                </div>

                <div className="preview-section">
                  <label>Enviar a:</label>
                  <div className="recipients-info">
                    <div className="recipient-header">
                      <strong>👥 {formData.usuariosSeleccionados.length} usuarios seleccionados</strong>
                    </div>
                    <div className="recipients-accordion">
                      {['Babies', 'Minies', 'Artes Proféticas'].map(grupo => {
                        const usuariosDelGrupoSeleccionados = gruposInfo[grupo].usuarios.filter(u =>
                          formData.usuariosSeleccionados.includes(u)
                        );
                        
                        if (usuariosDelGrupoSeleccionados.length === 0) return null;
                        
                        return (
                          <div key={grupo} className="accordion-item">
                            <button
                              type="button"
                              className="accordion-header"
                              onClick={() => toggleGroupExpanded(grupo)}
                            >
                              <span className="accordion-toggle">
                                {expandedGroups[grupo] ? '▼' : '▶'}
                              </span>
                              <span className="accordion-title">{grupo}</span>
                              <span className="accordion-count">
                                {usuariosDelGrupoSeleccionados.length}/{gruposInfo[grupo].cantidad}
                              </span>
                            </button>
                            {expandedGroups[grupo] && (
                              <div className="accordion-content">
                                {usuariosDelGrupoSeleccionados.map((usuario, idx) => (
                                  <div key={idx} className="recipient-item">
                                    <span className="recipient-icon">✓</span>
                                    {usuario}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="preview-section">
                  <label>Mensaje:</label>
                  <div className="message-preview-box">
                    {formData.contenido}
                  </div>
                </div>
              </div>

              <div className="send-warnings">
                <div className="warning-item">
                  ℹ️ Se enviará inmediatamente a todos los destinatarios
                </div>
                <div className="warning-item">
                  ℹ️ Los usuarios recibirán notificación del nuevo mensaje
                </div>
              </div>
            </div>

            <div className="send-modal-actions">
              <button
                className="btn-send-cancel"
                onClick={() => setSendModal(false)}
                disabled={isLoading}
              >
                ← Volver
              </button>
              <button
                className="btn-send-confirm"
                onClick={handleConfirmSend}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Enviando...' : '✓ Sí, Enviar Ahora'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationManagement;
