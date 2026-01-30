import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/Contact.css';

function Contact() {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Inicializar EmailJS una sola vez al montar el componente
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_PUBLIC_KEY);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Paso 1: Guardar en Supabase (API)
      const apiResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!apiResponse.ok) throw new Error('Error al guardar en base de datos');

      // Paso 2: Enviar email con EmailJS
      await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_PUBLIC_KEY
      );

      setIsSubmitted(true);
      
      // Resetear el formulario
      setFormData({
        name: '', email: '', phone: '', subject: '', message: ''
      });

      setTimeout(() => setIsSubmitted(false), 5000);

    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Ponte en Contacto</h1>
          <p className="contact-subtitle">Estamos aquí para ayudarte. Contáctanos con cualquier pregunta o inquietud.</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Información de Contacto</h2>
            
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-text">
                <h3>Ubicación</h3>
                <p><strong>Conversatorio SINEM (contiguo al Gimnasio Eddy Bermúdez)<br />Limón centro</strong></p>
                <p><a href="https://maps.app.goo.gl/FSH6idUBdTiSeAK3A" target="_blank" rel="noopener noreferrer" className="map-link">Ver en Google Maps</a></p>
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
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" ref={form} onSubmit={handleSubmit}>
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
                disabled={isSubmitted || isLoading}
              >
                {isLoading ? 'Enviando...' : isSubmitted ? '¡Mensaje Enviado!' : 'Enviar Mensaje'}
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