import React from 'react';
// importación de Swiper eliminada para versión en grilla
import '../styles/Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Mi hijo ha mejorado mucho en confianza desde que comenzó en Arte Brilla. Los instructores son muy dedicados.",
      author: "María García",
      role: "Madre de estudiante Babies",
      rating: 5
    },
    {
      id: 2,
      quote: "La metodología profesional y el ambiente amigable hacen que mis hijas disfruten venir a clases.",
      author: "Juan López",
      role: "Padre de estudiantes Minies",
      rating: 5
    },
    {
      id: 3,
      quote: "Estoy muy agradecida con el equipo docente. Han ayudado a mis hijas a encontrar su pasión por la danza.",
      author: "Carmen Rodríguez",
      role: "Madre de estudiante Artes Proféticas",
      rating: 5
    },
    {
      id: 4,
      quote: "Los eventos que organizan son increíbles. El nivel profesional es realmente notorio.",
      author: "Elena Martínez",
      role: "Abuela de estudiante",
      rating: 5
    }
  ];

  // Estilo polaroid: tarjeta con marco, avatar inicial, texto y nombre manuscrito
  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  }
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-polaroid-list">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-polaroid">
              <div className="polaroid-avatar">
                <span>{getInitials(testimonial.author)}</span>
              </div>
              <div className="polaroid-content">
                <blockquote className="polaroid-quote">{testimonial.quote}</blockquote>
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
              </div>
              <div className="polaroid-footer">
                <span className="polaroid-author">{testimonial.author}</span>
                <span className="polaroid-role">{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
