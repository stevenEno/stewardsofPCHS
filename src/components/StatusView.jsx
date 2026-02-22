import styles from '../styles/StatusView.module.css';

function StatusView({ title, body }) {
  return (
    <section className={styles.wrapper} role="status" aria-live="polite">
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}

export default StatusView;
