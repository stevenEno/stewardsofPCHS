import Modal from 'react-modal';
import styles from '../styles/ProjectModal.module.css';

function ProjectModal({ project, isOpen, onClose }) {
  if (!project) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`Project details for ${project.name}`}
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      <div className={styles.header}>
        <h2>{project.name}</h2>
        <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close project modal">
          Close
        </button>
      </div>
      <video
        className={styles.video}
        src={project.demoVideoUrl}
        controls
        loop
        autoPlay
        muted
        playsInline
        preload="metadata"
      />
      <p className={styles.description}>{project.description}</p>
      <p className={styles.student}>Student: {project.studentName}</p>
      {project.githubLink ? (
        <a className={styles.link} href={project.githubLink} target="_blank" rel="noreferrer">
          View GitHub branch / PR
        </a>
      ) : null}
      {project.embedUrl ? (
        <iframe
          className={styles.iframe}
          title={`${project.name} live preview`}
          src={project.embedUrl}
          loading="lazy"
        />
      ) : null}
    </Modal>
  );
}

export default ProjectModal;
