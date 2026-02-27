import styles from '../styles/GitWalkthrough.module.css';

const REPO_URL = 'https://github.com/stevenEno/stewardsofPCHS';

function GitWalkthrough() {
  return (
    <section id="git-walkthrough" className={styles.section} aria-label="Student Git contribution walkthrough">
      <div className={styles.headerRow}>
        <p className={styles.kicker}>Contribution Guide</p>
        <h2>Student Git Walkthrough</h2>
        <p>
          Use this exact workflow to submit your project to the live Seawolf Project Showcase. Every merged pull request to
          <code>main</code> deploys automatically.
        </p>
        <p>
          Official repository: <a href={REPO_URL} target="_blank" rel="noreferrer">{REPO_URL}</a>
        </p>
      </div>

      <ol className={styles.steps}>
        <li>
          <h3>1) Fork and clone the exact repo</h3>
          <p>
            Fork <a href={REPO_URL} target="_blank" rel="noreferrer">stevenEno/stewardsofPCHS</a>, then clone your fork.
          </p>
          <pre className={styles.codeBlock}><code>{`git clone https://github.com/YOUR-USERNAME/stewardsofPCHS.git\ncd stewardsofPCHS`}</code></pre>
        </li>

        <li>
          <h3>2) Create a branch for your submission</h3>
          <p>Branch names should describe your work clearly.</p>
          <pre className={styles.codeBlock}><code>{`git checkout -b add-my-project`}</code></pre>
        </li>

        <li>
          <h3>3) Add your project folder with required files</h3>
          <p>Create a folder at <code>/projects/your-project-slug/</code> and include all required files.</p>
          <ul className={styles.requirements}>
            <li><code>project.json</code></li>
            <li><code>demo.mp4</code> (5-7 seconds, short looping clip)</li>
            <li><code>thumbnail.jpg</code> (representative screenshot)</li>
            <li>Your source files</li>
          </ul>
          <p>Example:</p>
          <pre className={styles.codeBlock}><code>{`/projects/my-ai-app/
  project.json
  demo.mp4
  thumbnail.jpg
  index.html
  app.js`}</code></pre>
        </li>

        <li>
          <h3>4) Build a valid <code>project.json</code></h3>
          <p>Use this schema exactly:</p>
          <pre className={styles.codeBlock}><code>{`{
  "name": "My AI App",
  "description": "What problem your project solves and how it works.",
  "studentName": "Your Name",
  "githubLink": "https://github.com/YOUR-USERNAME/stewardsofPCHS/pull/123"
}`}</code></pre>
          <p>
            Tip: after you open your PR, update <code>githubLink</code> to your PR URL in a follow-up commit.
          </p>
        </li>

        <li>
          <h3>5) Generate <code>demo.mp4</code> (required)</h3>
          <p>Record your project running, then trim to 5-7 seconds.</p>
          <div className={styles.linkRow}>
            <a href="https://www.ffmpeg.org/download.html" target="_blank" rel="noreferrer">Download FFmpeg</a>
            <a href="https://obsproject.com/" target="_blank" rel="noreferrer">OBS Studio (recording)</a>
          </div>
          <p>Mac setup (if Homebrew is not installed):</p>
          <pre className={styles.codeBlock}><code>{`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`}</code></pre>
          <p>Mac install command (requires Homebrew):</p>
          <pre className={styles.codeBlock}><code>{`brew install ffmpeg`}</code></pre>
          <p>Trim your recording:</p>
          <pre className={styles.codeBlock}><code>{`ffmpeg -i recording.mp4 -t 7 -an -movflags +faststart demo.mp4`}</code></pre>
          <p>Optional: force web-friendly size/compression:</p>
          <pre className={styles.codeBlock}><code>{`ffmpeg -i recording.mp4 -t 7 -an -vf "scale=1280:-2" -c:v libx264 -preset medium -crf 24 -movflags +faststart demo.mp4`}</code></pre>
        </li>

        <li>
          <h3>6) Generate <code>thumbnail.jpg</code> (required)</h3>
          <p>Create from first frame of your demo video:</p>
          <pre className={styles.codeBlock}><code>{`ffmpeg -i demo.mp4 -vf "select=eq(n\\,0)" -q:v 3 thumbnail.jpg`}</code></pre>
        </li>

        <li>
          <h3>7) Commit, push, and open your PR</h3>
          <pre className={styles.codeBlock}><code>{`git add .
git commit -m "Add my project"
git push origin add-my-project`}</code></pre>
          <p>Open a pull request from your branch into <code>stevenEno/stewardsofPCHS:main</code>.</p>
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
        <h3>Submission checklist (must pass)</h3>
        <ul>
          <li>Project folder is inside <code>/projects/</code> with a unique slug name.</li>
          <li><code>project.json</code>, <code>demo.mp4</code>, and <code>thumbnail.jpg</code> exist.</li>
          <li><code>demo.mp4</code> is 5-7 seconds and plays correctly.</li>
          <li><code>thumbnail.jpg</code> loads correctly.</li>
          <li>PR targets <code>main</code> on <code>stevenEno/stewardsofPCHS</code>.</li>
        </ul>
      </div>

      <div className={styles.resources}>
        <h3>Helpful tools and tutorials</h3>
        <ul>
          <li><a href="https://github.com/apps/desktop" target="_blank" rel="noreferrer">GitHub Desktop</a></li>
          <li><a href="https://git-scm.com/downloads" target="_blank" rel="noreferrer">Install Git</a></li>
          <li><a href="https://docs.github.com/en/get-started/start-your-journey/hello-world" target="_blank" rel="noreferrer">GitHub Hello World</a></li>
          <li><a href="https://git-scm.com/book/en/v2" target="_blank" rel="noreferrer">Pro Git (free)</a></li>
          <li><a href="https://code.visualstudio.com/docs/sourcecontrol/overview" target="_blank" rel="noreferrer">VS Code source control guide</a></li>
        </ul>
      </div>
    </section>
  );
}

export default GitWalkthrough;
