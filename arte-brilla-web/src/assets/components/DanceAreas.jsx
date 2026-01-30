import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/DanceAreas.css';

const DanceAreas = () => {
  const areas = [
    {
      id: 1,
      title: 'Arte Brilla Babys',
      ageRange: '3 - 5 años',
      description: 'Iniciación centrada en coordinación, juego y expresión temprana.',
      icon: '👶',
      color: 'pink'
    },
    {
      id: 2,
      title: 'Babies Shine',
      ageRange: '3 - 5 años',
      description: 'Metodología lúdica para técnica básica y confianza escénica.',
      icon: '🌟',
      color: 'purple'
    },
    {
      id: 3,
      title: 'Arte Brilla Minis',
      ageRange: '6 - 12 años',
      description: 'Programa integral para técnica y preparación escénica.',
      icon: '👯',
      color: 'gold'
    },
    {
      id: 4,
      title: 'Arte Profética Brilla',
      ageRange: 'Adolescentes y adultos',
      description: 'Programa avanzado en interpretación y performance con propósito.',
      icon: '✨',
      color: 'blue'
    }
  ];

  return (
    <section className="dance-areas site-section">
      <div className="container">
        <div className="section-header">
          <h2>Equipos que conforman la Academia</h2>
        </div>

        <div className="areas-carousel">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={3}
            navigation={{
              nextEl: '.areas-next',
              prevEl: '.areas-prev',
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            loop={true}
            className="areas-swiper"
          >
            {areas.map(area => (
              <SwiperSlide key={area.id}>
                <div className={`area-card area-${area.color}`}>
                  <div className="area-icon">{area.icon}</div>
                  <h3>{area.title}</h3>
                  <p className="age-range">{area.ageRange}</p>
                  <p className="description">{area.description}</p>
                  <Link to="/classes" className="area-btn">Ver programa</Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="carousel-btn areas-prev">
            <span>←</span>
          </button>
          <button className="carousel-btn areas-next">
            <span>→</span>
          </button>

        </div>
      </div>
    </section>
  );
};

export default DanceAreas;
