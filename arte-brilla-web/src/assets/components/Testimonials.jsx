import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
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
    },
    {
      id: 5,
      quote: "Recomiendo Arte Brilla a todos. La atención al detalle y pasión por la danza es inspiradora.",
      author: "Patricia Sánchez",
      role: "Madre de estudiante Minies",
      rating: 5
    },
    {
      id: 6,
      quote: "Las clases son excelentes y el equipo es muy profesional. Mi hijo ha aprendido mucho.",
      author: "Carlos Mendoza",
      role: "Padre de estudiante",
      rating: 5
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>Lo que dicen nuestros estudiantes</h2>
          <p>Testimonios de familias que confían en nuestro trabajo</p>
        </div>

        <div className="carousel-wrapper">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active',
              bulletClass: 'swiper-pagination-bullet'
            }}
            navigation={{
              nextEl: '.testimonials-next',
              prevEl: '.testimonials-prev',
            }}
            loop={true}
            className="testimonials-swiper"
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

          <button className="carousel-btn testimonials-prev">
            <span>←</span>
          </button>
          <button className="carousel-btn testimonials-next">
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
