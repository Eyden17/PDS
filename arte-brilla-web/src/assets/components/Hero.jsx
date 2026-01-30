import React from 'react';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Fondo con imagen */}
      <div className="hero-background">
        <img 
          src="https://fkikijbwjzgoxolqyrqp.supabase.co/storage/v1/object/public/public-media/web-media/hero_img.webp" 
          alt="Estudiantes de danza en clase"
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Contenido principal */}
      <div className="hero-content">
      {/* Título principal */}
      <h1 className="main-title">
        La danza transmite <br />
        <span className="highlight">el ritmo que hay dentro de ti</span>
      </h1>

      <div className="hero-underline"></div>

    </div>
  </div>
  );
};

export default Hero;