import React from 'react';
import '../styles/Team.css';

const Team = () => {
  // Usando API de Unsplash para imágenes aleatorias de mujeres en contexto de danza/fitness
  const teachers = [
    {
      id: 1,
      name: 'Instructora 1',
      specialty: 'Babies & Minies',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&h=500&fit=crop&crop=faces'
    },
    {
      id: 2,
      name: 'Instructora 2',
      specialty: 'Minies & Artes Proféticas',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&h=500&fit=crop&crop=faces'
    },
    {
      id: 3,
      name: 'Instructora 3',
      specialty: 'Artes Proféticas',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&h=500&fit=crop&crop=faces'
    },
    {
      id: 4,
      name: 'Instructora 4',
      specialty: 'Todas las áreas',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=500&h=500&fit=crop&crop=faces'
    }
  ];

  return (
    <section className="team-section">
      <div className="container">
        <div className="section-header">
          <h2>Nuestro Equipo Docente</h2>
          <p>Instructores certificados con amplia experiencia en formación de danza</p>
        </div>

        <div className="team-grid">
          {teachers.map(teacher => (
            <div key={teacher.id} className="team-card">
              <div className="teacher-image">
                <img 
                  src={teacher.image} 
                  alt={teacher.name}
                  loading="lazy"
                />
              </div>
              <div className="teacher-info">
                <h3>{teacher.name}</h3>
                <p className="specialty">{teacher.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
