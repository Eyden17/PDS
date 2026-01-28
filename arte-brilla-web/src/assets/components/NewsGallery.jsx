import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import '../styles/NewsGallery.css';

const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M4 7h3l2-2h6l2 2h3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

// Paleta para placeholders de color cuando no hay imagen
const FALLBACKS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#30cfd0', '#330867'],
];

function hashToIndex(str) {
  const s = String(str || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % FALLBACKS.length;
}

function getGradientStyle(id) {
  const [a, b] = FALLBACKS[hashToIndex(id)];
  return { background: `linear-gradient(135deg, ${a}, ${b})` };
}

function mapDbNewsToCard(n) {
  const title = n.title ?? '';
  const content = n.content ?? '';
  const short = n.short_description ?? (content ? String(content).slice(0, 140) : '');
  const image = n.cover_url ?? n.cover_media_url ?? null;

  return {
    id: n.id,
    title,
    image,
    excerpt: short,
  };
}

const SkeletonFeatured = () => (
  <div className="news-featured">
    <article className="featured-card sample">
      <div className="featured-media">
        <div className="skeleton skeleton-media skeleton-featured" />
      </div>
      <div className="news-card-body">
        <div className="skeleton skeleton-line skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-short" />
        <div className="skeleton skeleton-btn" />
      </div>
    </article>

    <div className="featured-list">
      {Array.from({ length: 3 }).map((_, i) => (
        <article key={i} className="news-card small sample">
          <div className="card-media">
            <div className="skeleton skeleton-media skeleton-small" />
          </div>
          <div className="news-card-body">
            <div className="skeleton skeleton-line skeleton-title-sm" />
            <div className="skeleton skeleton-btn-sm" />
          </div>
        </article>
      ))}
    </div>
  </div>
);

const MediaBlock = ({ item, large = false }) => {
  // Si hay imagen, render img
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        onError={(e) => {
          // Si falla la URL, ocultamos imagen y dejamos el placeholder por CSS/markup
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) parent.setAttribute('data-noimg', 'true');
        }}
      />
    );
  }

  // Si NO hay imagen, placeholder con gradiente + ícono
  return (
    <div
      className={`news-noimage ${large ? 'large' : 'small'}`}
      style={getGradientStyle(item.id)}
      aria-label="Noticia sin imagen"
    >
      <div className="news-noimage-inner">
        <CameraIcon />
        <span>Sin imagen</span>
      </div>
    </div>
  );
};

const NewsGallery = ({ articles = null } = {}) => {
  const [apiNews, setApiNews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Si te pasan articles, NO pegamos al API
  const usePassed = Array.isArray(articles);

  useEffect(() => {
    if (usePassed) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await newsService.list();
        const rows = res?.data ?? res ?? [];
        const mapped = rows.map(mapDbNewsToCard);
        if (mounted) setApiNews(mapped);
      } catch {
        if (mounted) setApiNews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [usePassed]);

  const newsItems = useMemo(() => {
    if (usePassed) return Array.isArray(articles) ? articles : [];
    return apiNews;
  }, [usePassed, articles, apiNews]);

  // ✅ Skeleton solo cuando viene del API y está cargando
  if (!usePassed && loading) {
    return (
      <section className="news-gallery">
        <div className="container">
          <div className="section-header">
            <h2>Noticias</h2>
          </div>
          <SkeletonFeatured />
        </div>
      </section>
    );
  }

  // ✅ Si ya cargó y no hay nada
  if (!newsItems.length) {
    return (
      <section className="news-gallery">
        <div className="container">
          <div className="section-header">
            <h2>Noticias</h2>
            <p className="muted">Últimas actualizaciones e imágenes de la academia</p>
          </div>

          <div className="news-empty">
            <div className="news-empty-icon"><CameraIcon /></div>
            <h3>No hay noticias aún</h3>
            <p className="muted">Cuando publiques una noticia, aparecerá aquí automáticamente.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-gallery">
      <div className="container">
        <div className="section-header">
          <h2>Noticias</h2>
          <p className="muted">Últimas actualizaciones e imágenes de la academia</p>
        </div>

        {newsItems.length > 1 ? (
          <div className="news-featured">
            <article className="featured-card">
              <div className="featured-media">
                <MediaBlock item={newsItems[0]} large />
              </div>
              <div className="news-card-body">
                <h3>{newsItems[0].title}</h3>
                {newsItems[0].excerpt && <p className="muted excerpt">{newsItems[0].excerpt}</p>}
                <Link to={`/news/${newsItems[0].id}`} className="read-more">Leer</Link>
              </div>
            </article>

            <div className="featured-list">
              {newsItems.slice(1).map(item => (
                <article key={item.id} className="news-card small">
                  <div className="card-media">
                    <MediaBlock item={item} />
                  </div>
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
            {newsItems.map(item => (
              <article key={item.id} className="news-card">
                <div className="card-media">
                  <MediaBlock item={item} large />
                </div>
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
