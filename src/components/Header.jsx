import styles from '../styles/Header.module.css';
import { getConfig } from '../lib/runtimeConfig';

const REPO_URL = getConfig('VITE_GITHUB_REPO_URL', 'https://github.com/steveneno/stewardsofPCHS');

function Header({ useSamplePreview, onToggleSample, hasLiveProjects }) {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <p>Stewards of PCHS</p>
        <p>Building student excellence through code and collaboration</p>
      </div>
      <div className={styles.inner}>
        <div>
          <p className={styles.kicker}>Student Innovation</p>
          <h1 className={styles.title}>Student Projects Showcase</h1>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.modeButton}
            onClick={onToggleSample}
            aria-label={useSamplePreview ? 'Switch to live GitHub project mode' : 'Switch to sample preview mode'}
            disabled={!hasLiveProjects && useSamplePreview}
          >
            {useSamplePreview ? 'Switch To Live Data' : 'Preview Sample Data'}
          </button>
          <a
            className={styles.repoLink}
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository contribution guide"
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
