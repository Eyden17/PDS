import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NewsGallery.css';

const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 7h3l2-2h6l2 2h3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const NewsGallery = ({ articles = null } = {}) => {
  // Not hooked to an API yet. Use passed articles if available, otherwise fallback to a sample demo item so the section is visible.
  const newsItems = Array.isArray(articles) ? articles : [];

  const sample = [
    {
      id: 'demo-1',
      title: 'Noticia de Prueba: Gran Gala de Danza',
      image: 'https://picsum.photos/seed/news-demo/1200/800',
      excerpt: 'Esta es una noticia de demostración para que puedas ver cómo quedaría la sección de noticias en la página de inicio.'
    },
    {
      id: 'demo-2',
      title: 'Clases Abiertas: Trae a un Amigo',
      image: 'https://picsum.photos/seed/news-2/1200/800',
      excerpt: 'Este sábado abrimos nuestras puertas para que pruebes una clase gratis en familia o con amigos.'
    },
    {
      id: 'demo-3',
      title: 'Inscripciones de Verano',
      image: 'https://picsum.photos/seed/news-3/1200/800',
      excerpt: 'Abiertas las inscripciones para los cursos intensivos de verano, cupos limitados.'
    },
    {
      id: 'demo-4',
      title: 'Historias de Alumnos',
      image: 'https://picsum.photos/seed/news-4/1200/800',
      excerpt: 'Conoce a nuestros alumnos destacados y sus progresos en la academia.'
    }
  ];

  const itemsToShow = newsItems.length ? newsItems : sample;
  const isSample = newsItems.length === 0;

  return (
    <section className="news-gallery">
      <div className="container">
        <div className="section-header">
          <h2>Noticias</h2>
          <p className="muted">Últimas actualizaciones e imágenes de la academia</p>
        </div>

        {itemsToShow.length > 1 ? (
          <div className="news-featured">
            <article className={`featured-card ${isSample ? 'sample' : ''}`}>
              <img
                src={itemsToShow[0].image}
                alt={itemsToShow[0].title}
                loading="lazy"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Imagen+no+disponible'; }}
              />
              <div className="news-card-body">
                <h3>{itemsToShow[0].title}</h3>
                {itemsToShow[0].excerpt && <p className="muted excerpt">{itemsToShow[0].excerpt}</p>}
                <Link to={`/news/${itemsToShow[0].id}`} className="read-more">Leer</Link>
              </div>
            </article>

            <div className="featured-list">
              {itemsToShow.slice(1).map(item => (
                <article key={item.id} className={`news-card small ${isSample ? 'sample' : ''}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'; }}
                  />
                  <div className="news-card-body">
                    <h4>{item.title}</h4>
                    <Link to={`/news/${item.id}`} className="read-more">Leer</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="news-grid">
            {itemsToShow.map(item => (
              <article key={item.id} className={`news-card ${isSample ? 'sample' : ''}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/1200x800?text=Imagen+no+disponible'; }}
                />
                <div className="news-card-body">
                  <h3>{item.title}</h3>
                  {item.excerpt && <p className="muted excerpt">{item.excerpt}</p>}
                  <Link to={`/news/${item.id}`} className="read-more">Leer</Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default NewsGallery;
