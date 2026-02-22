import styles from '../styles/HighlightedProject.module.css';

function HighlightedProject({ project, onOpen }) {
  if (!project) {
    return null;
  }

  return (
    <section className={styles.section} aria-label="Featured student project">
      <video
        className={styles.video}
        src={project.demoVideoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Featured project video for ${project.name}`}
      />
      <button
        type="button"
        className={styles.overlay}
        onClick={() => onOpen(project)}
        aria-label={`Open details for featured project ${project.name}`}
      >
        <h2 className={styles.name}>{project.name}</h2>
        <p className={styles.description}>{project.description}</p>
        <p className={styles.student}>By {project.studentName}</p>
      </button>
    </section>
  );
}

export default HighlightedProject;
