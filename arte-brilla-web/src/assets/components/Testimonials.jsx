import React, { useEffect, useState } from 'react';
import '../styles/Testimonials.css';
import { testimonialsService } from '../../services/testimonialsService';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estilo polaroid: tarjeta con marco, avatar inicial, texto y nombre manuscrito
  function getInitials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    const a = parts[0]?.[0] ?? '';
    const b = (parts.length > 1 ? parts[parts.length - 1][0] : '') ?? '';
    return (a + b).toUpperCase();
  }

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await testimonialsService.listPublic();
      const rows = res?.data ?? res ?? [];
      const normalized = (rows || []).map((r) => ({
        id: r.id,
        quote: r.text,
        author: r.author_name,
        role: r.author_role || '',
        rating: Number(r.rating || 5),
      }));
      setTestimonials(normalized);
    } catch (err) {
      console.error('Error cargando reseñas:', err);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="testimonials-section">
      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>Cargando reseñas…</div>
        ) : testimonials.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            Aún no hay reseñas publicadas.
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default Testimonials;
