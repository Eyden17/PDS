import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../styles/TestimonialCarousel.css';
import { testimonialsService } from '../../services/testimonialsService';

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <section className="testimonial-section">
      <div className="container">
        <div className="section-header">
          <h2>Lo que dicen nuestros estudiantes</h2>
          <p>Testimonio de familias que confían en nuestro trabajo</p>
        </div>


        <div className="carousel-wrapper">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>Cargando reseñas…</div>
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              Aún no hay reseñas publicadas.
            </div>
          ) : (
            <>
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={testimonials.length > 1 ? {
                  delay: 5000,
                  disableOnInteraction: false,
                } : false}
                pagination={{
                  clickable: true,
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                  bulletClass: 'swiper-pagination-bullet'
                }}
                navigation={{
                  nextEl: '.swiper-next',
                  prevEl: '.swiper-prev',
                }}
                loop={testimonials.length > 1}
                className="testimonial-swiper"
              >
                {testimonials.map(testimonial => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="testimonial-card">
                      <div className="testimonial-stars">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="star">⭐</span>
                        ))}
                      </div>
                      <blockquote className="testimonial-quote">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="testimonial-author">
                        <h4>{testimonial.author}</h4>
                        <p>{testimonial.role}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {testimonials.length > 1 && (
                <>
                  <button className="carousel-btn swiper-prev">
                    <span>←</span>
                  </button>
                  <button className="carousel-btn swiper-next">
                    <span>→</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
