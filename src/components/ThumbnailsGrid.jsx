import { useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';
import styles from '../styles/ThumbnailsGrid.module.css';

function ThumbnailsGrid({ projects, onOpen }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    // Masonry handles uneven card heights for a compact, visual gallery.
    const masonry = new Masonry(containerRef.current, {
      itemSelector: `.${styles.card}`,
      percentPosition: true,
      transitionDuration: '0.2s'
    });

    // Layout needs to be recalculated after images load.
    const images = containerRef.current.querySelectorAll('img');
    images.forEach((image) => image.addEventListener('load', () => masonry.layout()));

    masonry.layout();
    return () => masonry.destroy();
  }, [projects]);

  return (
    <section className={styles.section} aria-label="All student projects">
      <div className={styles.grid} ref={containerRef}>
        {projects.map((project) => (
          <article key={project.slug} className={styles.card}>
            <button
              type="button"
              className={styles.cardButton}
              onClick={() => onOpen(project)}
              aria-label={`Open details for ${project.name}`}
            >
              <img
                className={styles.thumbnail}
                src={project.thumbnailUrl}
                alt={`${project.name} thumbnail`}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.meta}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ThumbnailsGrid;
