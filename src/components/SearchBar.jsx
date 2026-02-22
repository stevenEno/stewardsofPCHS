import styles from '../styles/SearchBar.module.css';

function SearchBar({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="project-search">
        Search projects
      </label>
      <input
        id="project-search"
        className={styles.input}
        type="text"
        placeholder="Filter by project name or student"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search projects by project name or student name"
      />
    </div>
  );
}

export default SearchBar;
