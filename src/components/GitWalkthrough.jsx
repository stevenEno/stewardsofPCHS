import styles from '../styles/GitWalkthrough.module.css';

function GitWalkthrough() {
  return (
    <section id="git-walkthrough" className={styles.section} aria-label="Student Git contribution walkthrough">
      <div className={styles.headerRow}>
        <p className={styles.kicker}>Contribution Guide</p>
        <h2>Student Git Walkthrough</h2>
        <p>
          Follow this exact process to get your project featured on the showcase site. Every accepted pull request merged
          to <code>main</code> is deployed automatically on Vercel.
        </p>
      </div>

      <ol className={styles.steps}>
        <li>
          <h3>Fork the repository</h3>
          <p>
            Click <strong>Fork</strong> on GitHub to create your own copy.
          </p>
          <a href="https://docs.github.com/en/get-started/quickstart/fork-a-repo" target="_blank" rel="noreferrer">
            GitHub Docs: Fork a repo
          </a>
        </li>
        <li>
          <h3>Clone your fork locally</h3>
          <p>
            Use GitHub Desktop or the terminal to clone your fork to your computer.
          </p>
          <div className={styles.linkRow}>
            <a href="https://github.com/apps/desktop" target="_blank" rel="noreferrer">GitHub Desktop</a>
            <a href="https://git-scm.com/downloads" target="_blank" rel="noreferrer">Install Git</a>
          </div>
        </li>
        <li>
          <h3>Create a new branch</h3>
          <p>
            In terminal, run <code>git checkout -b add-my-project</code> (or similar) before adding files.
          </p>
        </li>
        <li>
          <h3>Add your project folder</h3>
          <p>
            Create <code>/projects/your-project-slug/</code> and include <code>project.json</code>, <code>demo.mp4</code>,
            <code>thumbnail.jpg</code>, and source files.
          </p>
          <div className={styles.linkRow}>
            <a href="https://www.ffmpeg.org/download.html" target="_blank" rel="noreferrer">Download FFmpeg</a>
            <a href="https://obsproject.com/" target="_blank" rel="noreferrer">OBS Studio</a>
          </div>
        </li>
        <li>
          <h3>Commit and push</h3>
          <p>
            Run <code>git add .</code>, <code>git commit -m "Add my project"</code>, and <code>git push origin add-my-project</code>.
          </p>
        </li>
        <li>
          <h3>Open a pull request</h3>
          <p>Submit a PR from your fork branch into this repo’s <code>main</code> branch.</p>
          <a
            href="https://docs.github.com/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Docs: Create a PR from a fork
          </a>
        </li>
      </ol>

      <div className={styles.resources}>
        <h3>Helpful tutorials and references</h3>
        <ul>
          <li>
            <a href="https://docs.github.com/en/get-started/start-your-journey/hello-world" target="_blank" rel="noreferrer">
              GitHub Hello World tutorial
            </a>
          </li>
          <li>
            <a href="https://git-scm.com/book/en/v2" target="_blank" rel="noreferrer">
              Pro Git book (free)
            </a>
          </li>
          <li>
            <a href="https://code.visualstudio.com/docs/sourcecontrol/overview" target="_blank" rel="noreferrer">
              VS Code source control guide
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default GitWalkthrough;
