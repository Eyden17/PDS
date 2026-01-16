import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Team.css';
const PersonIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 20c0-2.2 3.6-4 8-4s8 1.8 8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Team = () => {
  const team = {
    director: {
      name: 'Yethsira Wilson Cash',
      role: 'Directora',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=600&fit=crop&crop=faces'
    },
    docentes: [
      'Aneby Sandi Hernández',
      'Jeilyn Arley Zúñiga',
      'Natalie Hernández Monterosa'
    ],
    staff: [
      'Veleika Sandi Hernández',
      'Ingrid Chacón Valverde',
      'Kyonisha Cedeño Pila',
      'Serghianny Flores Mooke'
    ],
    coordinator: {
      name: 'Chung Lein Fung Zúñiga',
      role: 'Coordinadora de Producción'
    }
  };

  const members = [
    { name: team.director.name, role: team.director.role, image: team.director.image },
    ...team.docentes.map(name => ({ name, role: 'Docente' })),
    ...team.staff.map(name => ({ name, role: 'Staff' })),
    { name: team.coordinator.name, role: team.coordinator.role }
  ];

  return (
    <section className="team-section site-section">
      <div className="container">
        <div className="section-header">
          <h2>Nuestro Equipo</h2>
          <p className="muted">Conoce al equipo que hace posible Arte Brilla</p>
        </div>

        {/* Equipo (Carrusel) */}
        <div className="docentes-section">

          <div className="team-swiper-wrapper">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={3}
              navigation={{ nextEl: '.team-next', prevEl: '.team-prev' }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              loop={true}
              className="team-swiper"
            >
              {members.map(member => (
                <SwiperSlide key={member.name}>
                  <div className="person-card small">
                        <div className="person-icon" aria-hidden><PersonIcon /></div>
                    <div className="person-info">
                      <h4>{member.name}</h4>
                      <p className="role">{member.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="carousel-btn team-prev" aria-label="Prev">←</button>
            <button className="carousel-btn team-next" aria-label="Next">→</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Team;
