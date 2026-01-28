import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import '../styles/NewsDetail.css';

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

export default function NewsDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [item, setItem] = useState(null);
  const [allNews, setAllNews] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');

        const res = await newsService.getById(id);
        const n = res?.data ?? res;

        if (!mounted) return;

        setItem({
          id: n.id,
          title: n.title ?? '',
          content: n.content ?? '',
          created_at: n.created_at ?? null,
          category: n.category ?? null,
          cover_url: n.cover_url ?? n.cover_media_url ?? null,
        });
      } catch (e) {
        if (mounted) setErr(e.message || 'No se pudo cargar la noticia');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await newsService.listPublic();
        const news = (res?.data ?? res) || [];
        if (mounted) {
          setAllNews(news.filter(n => n.id !== id));
        }
      } catch (e) {
        console.log('Error cargando noticias:', e);
      }
    })();

    return () => { mounted = false; };
  }, [id]);

  const dateLabel = useMemo(() => {
    if (!item?.created_at) return '';
    return new Date(item.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [item]);

  const readingTime = useMemo(() => {
    if (!item?.content) return 0;
    const words = item.content.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [item]);

  if (loading) {
    return (
      <div className="news-detail-wrapper">
        <div className="container">
          <div className="news-detail-loader">
            <div className="spinner"></div>
            <p>Cargando noticia...</p>
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="news-detail-wrapper">
        <div className="container">
          <div className="news-detail-error">
            <h2>⚠️ Error</h2>
            <p>{err}</p>
            <Link to="/" className="btn-back-home">Volver a Inicio</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="news-detail-wrapper">
      <div className="container">
        <div className="news-detail-layout">
          <article className="news-detail-article">
            <div className="news-detail-header">
              {item.category && (
                <div className="category-badge">{item.category}</div>
              )}
              <h1 className="news-detail-title">{item.title}</h1>

              <div className="news-detail-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <time dateTime={item.created_at}>{dateLabel}</time>
                </div>
                {readingTime > 0 && (
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>{readingTime} min de lectura</span>
                  </div>
                )}
              </div>
            </div>

            {(item.cover_url || item.id) && (
              <div className="news-detail-image">
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="news-detail-img"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="news-detail-img-fallback" style={getGradientStyle(item.id)} />
                )}
              </div>
            )}

            <div className="news-detail-content">
              <div className="content-text">
                {item.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>

          {allNews.length > 0 && (
            <aside className="news-detail-sidebar">
              <h3 className="sidebar-title">Más Noticias</h3>
              <div className="news-sidebar-list">
                {allNews.map(news => (
                  <Link key={news.id} to={`/news/${news.id}`} className="news-sidebar-item">
                    <div className="news-sidebar-cover">
                      {news.cover_url ? (
                        <img
                          src={news.cover_url}
                          alt={news.title}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={getGradientStyle(news.id)} />
                      )}
                    </div>
                    <div className="news-sidebar-content">
                      {news.category && (
                        <span className="sidebar-badge">{news.category}</span>
                      )}
                      <h4 className="news-sidebar-title">{news.title}</h4>
                      {news.created_at && (
                        <span className="news-sidebar-date">
                          {new Date(news.created_at).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
