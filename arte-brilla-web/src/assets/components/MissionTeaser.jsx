import React from 'react';
import '../styles/Mission.css';

const MissionTeaser = () => {
  return (
    <section className="mission-teaser">
      <div className="container">
        <div className="mission-teaser-content">
          <h2>Nuestra Misión</h2>
          <p className="muted">
            Formar bailarines íntegros mediante educación técnica y valores.
            <a href="/about" className="link-cta"> Conoce más</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionTeaser;
