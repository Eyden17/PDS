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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr('');

        const res = await newsService.getById(id);
        // tu endpoint retorna { data }
        const n = res?.data ?? res;

        if (!mounted) return;

        setItem({
          id: n.id,
          title: n.title ?? '',
          content: n.content ?? '',
          created_at: n.created_at ?? null,
          category: n.category ?? null,
          // si luego enriquecés el endpoint para traer cover_url, usalo aquí
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

  const dateLabel = useMemo(() => {
    if (!item?.created_at) return '';
    return new Date(item.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [item]);

  if (loading) {
    return (
      <div className="news-detail container">
        <p>⏳ Cargando…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="news-detail container">
        <p>⚠️ {err}</p>
        <Link to="/" className="read-more">Volver</Link>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="news-detail container">
      <div className="news-detail-top">
        <Link to="/" className="read-more">← Volver</Link>
      </div>

      <header className="news-detail-header">
        <h1>{item.title}</h1>
        <div className="news-detail-meta">
          {item.category && <span className="badge">{item.category}</span>}
          {dateLabel && <span className="muted">📅 {dateLabel}</span>}
        </div>
      </header>

      <div className="news-detail-cover">
        {item.cover_url ? (
          <img
            src={item.cover_url}
            alt={item.title}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="news-detail-cover-fallback" style={getGradientStyle(item.id)} />
        )}
      </div>

      <article className="news-detail-content">
        <p style={{ whiteSpace: 'pre-wrap' }}>{item.content}</p>
      </article>
    </div>
  );
}
