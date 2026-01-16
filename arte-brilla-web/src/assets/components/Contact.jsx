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
                <p><strong>Conversatorio SINEM (contiguo al Gimnasio Eddy Bermúdez)<br />Limón centro</strong></p>
                <p><a href="https://www.google.com/maps/search/?api=1&query=Conversatorio+SINEM+contiguo+Gimnasio+Eddy+Berm%C3%BAdez+Lim%C3%B3n+centro" target="_blank" rel="noopener noreferrer" className="map-link">Ver en Google Maps</a></p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📞</div>
              <div className="info-text">
                <h3>Teléfono</h3>
                <p><a href="tel:+50687345820">+506 8734-5820</a></p>
                <p><a href="https://wa.me/50687345820" target="_blank" rel="noopener noreferrer" className="whatsapp-link">💬 WhatsApp</a></p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div className="info-text">
                <h3>Horario de Atención</h3>
                <p><strong>Sábados: 1:00 PM - 3:00 PM</strong></p>
              </div>
            </div>

            {/* Redes Sociales */}
            <div className="social-links">
              <h3>Síguenos</h3>
              <div className="social-icons">
                <a
                  href="https://www.instagram.com/yeth_w19?igsh=MWo3YjRldHJ3dGN5Yw=="
                  className="social-icon"
                  title="Instagram"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor: '#FCAF45'}} />
                        <stop offset="25%" style={{stopColor: '#FD1D1D'}} />
                        <stop offset="50%" style={{stopColor: '#E1306C'}} />
                        <stop offset="75%" style={{stopColor: '#C13584'}} />
                        <stop offset="100%" style={{stopColor: '#833AB4'}} />
                      </linearGradient>
                    </defs>
                    <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
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
