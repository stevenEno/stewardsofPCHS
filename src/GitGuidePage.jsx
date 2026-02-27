import Header from './components/Header';
import GitWalkthrough from './components/GitWalkthrough';
import styles from './styles/GitGuidePage.module.css';

function GitGuidePage() {
  return (
    <>
      <Header currentPage="guide" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Contributor Guide</p>
          <h1>Student Git Walkthrough</h1>
          <p>
            Ready to publish your work to the Seawolf Project Showcase? Follow this step-by-step guide to fork, branch,
            add your project, and open a pull request.
          </p>
        </section>
        <GitWalkthrough />
      </main>
    </>
  );
}

export default GitGuidePage;
