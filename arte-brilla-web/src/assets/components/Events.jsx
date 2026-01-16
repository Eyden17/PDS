import React from 'react';
import eventsData from '../../data/eventsData';
import '../styles/Events.css';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function toICS(event) {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + (event.durationMinutes || 60) * 60 * 1000);

  const formatICSDate = d => {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const min = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    return `${yyyy}${mm}${dd}T${hh}${min}${ss}Z`;
  };

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ArteBrilla//Event//ES',
    'BEGIN:VEVENT',
    `UID:${event.id}@artebrilla.local`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return ics;
}

const Events = ({ events = null, showCount = 4 }) => {
  const list = Array.isArray(events) ? events : eventsData;
  const now = Date.now();
  const upcoming = list
    .map(e => ({ ...e, _ts: new Date(e.date).getTime() }))
    .filter(e => e._ts >= now - 24 * 60 * 60 * 1000) // include today
    .sort((a, b) => a._ts - b._ts)
    .slice(0, showCount);

  if (!upcoming.length) {
    return (
      <section className="events-section site-section">
        <div className="container">
          <div className="section-header">
            <h2>Próximos eventos</h2>
            <p className="muted">No hay eventos programados por ahora.</p>
          </div>
        </div>
      </section>
    );
  }

  const downloadICS = (ev) => {
    const blob = new Blob([toICS(ev)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="events-section site-section">
      <div className="container">
        <div className="section-header">
          <h2>Próximos eventos</h2>
          <p className="muted">Fechas y actividades destacadas. ¡Reserva tu lugar!</p>
        </div>

        <div className="events-list">
          {upcoming.map(ev => (
            <article key={ev.id} className="event-card">
              <div className="date-chip" aria-hidden>
                <div className="day">{new Date(ev.date).getDate()}</div>
                <div className="month">{new Date(ev.date).toLocaleString(undefined, { month: 'short' }).toUpperCase()}</div>
              </div>

              <div className="event-body">
                <h3 className="event-title">{ev.title}</h3>
                <div className="meta">
                  <time dateTime={ev.date}>{formatDate(ev.date)} • {formatTime(ev.date)}</time>
                  <span className="location"> — {ev.location}</span>
                </div>
                <p className="event-desc">{ev.description}</p>

                <div className="actions">
                  <button className="btn" onClick={() => alert('Próximamente: detalles del evento')}>Detalles</button>
                  <button className="btn btn-outline" onClick={() => downloadICS(ev)}>Agregar al calendario</button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Events;