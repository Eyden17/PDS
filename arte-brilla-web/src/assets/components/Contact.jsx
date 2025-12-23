import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    setIsSubmitted(true);
    
    // Resetear el formulario después de 2 segundos
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h1 className="contact-title">Ponte en Contacto</h1>
          <p className="contact-subtitle">Estamos aquí para ayudarte. Contáctanos con cualquier pregunta o inquietud.</p>
        </div>

        <div className="contact-content">
          {/* Información de Contacto */}
          <div className="contact-info">
            <h2>Información de Contacto</h2>
            
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <h3>Ubicación</h3>
                <p>Calle Principal 123<br />Ciudad, Estado 12345</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h3>Teléfono</h3>
                <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-text">
                <h3>Email</h3>
                <p><a href="mailto:info@artebrilla.com">info@artebrilla.com</a></p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-text">
                <h3>Horario de Atención</h3>
                <p>Lunes - Viernes: 9:00 AM - 6:00 PM<br />Sábado: 10:00 AM - 4:00 PM<br />Domingo: Cerrado</p>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="social-links">
              <h3>Síguenos</h3>
              <div className="social-icons">
                <a href="#" className="social-icon" title="Facebook">f</a>
                <a href="#" className="social-icon" title="Instagram">📷</a>
                <a href="#" className="social-icon" title="Twitter">𝕏</a>
                <a href="#" className="social-icon" title="YouTube">▶</a>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Tu teléfono"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Asunto *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="¿Sobre qué es tu mensaje?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Cuéntanos con más detalle..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitted}
              >
                {isSubmitted ? '¡Mensaje Enviado!' : 'Enviar Mensaje'}
              </button>

              {isSubmitted && (
                <p className="success-message">Gracias por tu mensaje. Nos pondremos en contacto pronto.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
