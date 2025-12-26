// ========================================
// EJEMPLOS DE INTEGRACIÓN CON API
// ========================================

// 1. SERVICIO API PARA ESTUDIANTES
// Ubicación sugerida: src/services/studentService.js

export const studentService = {
  // Obtener todos los estudiantes
  getAllStudents: async () => {
    try {
      const response = await fetch('/api/estudiantes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Crear nuevo estudiante
  createStudent: async (studentData) => {
    try {
      const response = await fetch('/api/estudiantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  // Actualizar estudiante
  updateStudent: async (id, studentData) => {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Eliminar estudiante
  deleteStudent: async (id) => {
    try {
      const response = await fetch(`/api/estudiantes/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
};

// ========================================

// 2. SERVICIO API PARA PAGOS
// Ubicación sugerida: src/services/paymentService.js

export const paymentService = {
  // Obtener todos los pagos
  getAllPayments: async () => {
    try {
      const response = await fetch('/api/pagos');
      return await response.json();
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Obtener pagos pendientes
  getPendingPayments: async () => {
    try {
      const response = await fetch('/api/pagos?estado=pendiente');
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      throw error;
    }
  },

  // Registrar pago
  recordPayment: async (paymentData) => {
    try {
      const response = await fetch('/api/pagos/pagar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_pago: paymentData.id,
          cantidad_pagada: parseFloat(paymentData.amount),
          fecha_pago: new Date().toISOString(),
          metodo_pago: paymentData.metodo || 'efectivo'
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  },

  // Obtener resumen de pagos
  getPaymentSummary: async () => {
    try {
      const response = await fetch('/api/pagos/resumen');
      return await response.json();
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw error;
    }
  }
};

// ========================================

// 3. SERVICIO API PARA NOTICIAS
// Ubicación sugerida: src/services/newsService.js

export const newsService = {
  // Obtener noticias activas (usando el stored procedure)
  getActiveNews: async () => {
    try {
      const response = await fetch('/api/noticias/activas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching active news:', error);
      throw error;
    }
  },

  // Obtener todas las noticias (incluyendo expiradas)
  getAllNews: async () => {
    try {
      const response = await fetch('/api/noticias');
      return await response.json();
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  },

  // Crear nueva noticia
  createNews: async (newsData) => {
    try {
      const formData = new FormData();
      formData.append('titulo', newsData.titulo);
      formData.append('contenido', newsData.contenido);
      formData.append('duracion_dias', newsData.duracionDias);
      
      if (newsData.imagen) {
        formData.append('imagen', newsData.imagen);
      }

      const response = await fetch('/api/noticias', {
        method: 'POST',
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  },

  // Actualizar noticia
  updateNews: async (id, newsData) => {
    try {
      const formData = new FormData();
      formData.append('titulo', newsData.titulo);
      formData.append('contenido', newsData.contenido);
      formData.append('duracion_dias', newsData.duracionDias);
      
      if (newsData.imagen) {
        formData.append('imagen', newsData.imagen);
      }

      const response = await fetch(`/api/noticias/${id}`, {
        method: 'PUT',
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  // Eliminar noticia
  deleteNews: async (id) => {
    try {
      const response = await fetch(`/api/noticias/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
};

// ========================================

// 4. EJEMPLO DE USO EN COMPONENTE
// Reemplazar setState local con API calls

/*
ANTES (Estado Local):
const [students, setStudents] = useState([]);

DESPUÉS (Con API):
const [students, setStudents] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  fetchStudents();
}, []);

const fetchStudents = async () => {
  try {
    setLoading(true);
    const data = await studentService.getAllStudents();
    setStudents(data);
    setError(null);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleAddStudent = async () => {
  try {
    setLoading(true);
    const newStudent = await studentService.createStudent(formData);
    setStudents([...students, newStudent]);
    resetForm();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleDeleteStudent = async (id) => {
  try {
    await studentService.deleteStudent(id);
    setStudents(students.filter(s => s.id !== id));
  } catch (err) {
    setError(err.message);
  }
};
*/

// ========================================

// 5. RUTAS BACKEND RECOMENDADAS (Node.js/Express)

/*
// ESTUDIANTES
GET    /api/estudiantes              - Obtener todos
GET    /api/estudiantes/:id          - Obtener uno
POST   /api/estudiantes              - Crear
PUT    /api/estudiantes/:id          - Actualizar
DELETE /api/estudiantes/:id          - Eliminar

// PAGOS
GET    /api/pagos                    - Obtener todos
GET    /api/pagos/resumen            - Resumen estadístico
GET    /api/pagos?estado=pendiente   - Filtrar por estado
POST   /api/pagos/pagar              - Registrar pago
GET    /api/pagos/:id                - Obtener uno

// NOTICIAS
GET    /api/noticias                 - Obtener todas
GET    /api/noticias/activas         - Obtener solo activas
GET    /api/noticias/:id             - Obtener una
POST   /api/noticias                 - Crear
PUT    /api/noticias/:id             - Actualizar
DELETE /api/noticias/:id             - Eliminar
*/

// ========================================

// 6. VALIDACIÓN DE DATOS EN FRONTEND

export const validateStudent = (data) => {
  const errors = {};

  if (!data.nombre?.trim()) errors.nombre = 'El nombre es requerido';
  if (!data.apellido?.trim()) errors.apellido = 'El apellido es requerido';
  if (!data.encargado?.trim()) errors.encargado = 'El encargado es requerido';
  if (!data.telefonoEncargado?.trim()) {
    errors.telefonoEncargado = 'El teléfono es requerido';
  } else if (!/^[\d\s\-\+]+$/.test(data.telefonoEncargado)) {
    errors.telefonoEncargado = 'Formato de teléfono inválido';
  }
  if (!data.grupo?.trim()) errors.grupo = 'El grupo es requerido';

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validatePayment = (data) => {
  const errors = {};

  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'La cantidad debe ser mayor a 0';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateNews = (data) => {
  const errors = {};

  if (!data.titulo?.trim()) errors.titulo = 'El título es requerido';
  if (!data.contenido?.trim()) errors.contenido = 'El contenido es requerido';
  if (!data.duracionDias || data.duracionDias < 1) {
    errors.duracionDias = 'La duración debe ser mínimo 1 día';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

// ========================================

// 7. MANEJADOR DE ERRORES GLOBAL

export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    // No autorizado - redirigir a login
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    // Prohibido
    return 'No tienes permiso para realizar esta acción';
  } else if (error.response?.status === 404) {
    // No encontrado
    return 'El recurso solicitado no existe';
  } else if (error.response?.status === 500) {
    // Error del servidor
    return 'Error del servidor. Intenta más tarde';
  } else if (error.message === 'Network Error') {
    return 'Error de conexión. Verifica tu internet';
  }
  
  return error.message || 'Ocurrió un error desconocido';
};

// ========================================
