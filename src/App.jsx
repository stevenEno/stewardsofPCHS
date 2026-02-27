import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import Header from './components/Header';
import HighlightedProject from './components/HighlightedProject';
import ProjectModal from './components/ProjectModal';
import SearchBar from './components/SearchBar';
import StatusView from './components/StatusView';
import ThumbnailsGrid from './components/ThumbnailsGrid';
import { fetchProjectsFromGitHub } from './lib/githubApi';
import { sampleProjects } from './lib/sampleProjects';
import { filterProjects, pickRandomProject } from './lib/projectUtils';
import styles from './styles/App.module.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [liveError, setLiveError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [highlightedProject, setHighlightedProject] = useState(null);
  const [query, setQuery] = useState('');
  const [useSamplePreview, setUseSamplePreview] = useState(false);

  useEffect(() => {
    if (document.querySelector('#root')) {
      Modal.setAppElement('#root');
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setIsLoading(true);
      setLiveError('');

      try {
        const data = await fetchProjectsFromGitHub();
        if (!active) {
          return;
        }

        setProjects(data);

        if (data.length === 0) {
          setUseSamplePreview(true);
          setLiveError('No live GitHub projects yet. Showing sample preview projects for now.');
        }
      } catch (fetchError) {
        if (!active) {
          return;
        }

        setProjects([]);
        setUseSamplePreview(true);
        setLiveError('Live GitHub fetch is unavailable right now. Showing sample preview projects.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const hasLiveProjects = projects.length > 0;
  const displayProjects = useSamplePreview ? sampleProjects : projects;
  const filteredProjects = useMemo(() => filterProjects(displayProjects, query), [displayProjects, query]);

  useEffect(() => {
    setHighlightedProject(pickRandomProject(displayProjects));
  }, [displayProjects]);

  return (
    <div className={styles.app}>
      <Header
        useSamplePreview={useSamplePreview}
        onToggleSample={() => {
          if (useSamplePreview && !hasLiveProjects) {
            return;
          }
          setUseSamplePreview((current) => !current);
        }}
        hasLiveProjects={hasLiveProjects}
        currentPage="showcase"
      />

      <main>
        <section className={styles.introPanel}>
          <p className={styles.introLabel}>Where Seawolves Shine</p>
          <h2>Pacifica Students Building with the AI Agents and Solving Real World Problems</h2>
          <p>
            This is a celebration wall for student imagination, impact, and courage. Explore projects, ideas, and stories
            that show how Pacifica students are building with purpose.
          </p>
          <div className={styles.metrics}>
            <article>
              <span>{displayProjects.length}</span>
              <p>Student Stories Featured</p>
            </article>
            <article>
              <span>Bold</span>
              <p>Creative Thinking</p>
            </article>
            <article>
              <span>Real</span>
              <p>Community Impact</p>
            </article>
          </div>
        </section>

        {isLoading ? <StatusView title="Loading projects" body="Preparing the latest Seawolf project stories..." /> : null}

        {!isLoading && liveError ? <StatusView title="Preview notice" body={liveError} /> : null}

        {!isLoading && filteredProjects.length === 0 ? (
          <StatusView
            title="No projects found"
            body={query ? 'No projects match your current search.' : 'No projects are available in the current mode.'}
          />
        ) : null}

        {!isLoading && filteredProjects.length > 0 ? (
          <>
            <SearchBar value={query} onChange={setQuery} />
            <HighlightedProject
              project={highlightedProject && filteredProjects.some((item) => item.slug === highlightedProject.slug)
                ? highlightedProject
                : filteredProjects[0]}
              onOpen={setSelectedProject}
            />
            <ThumbnailsGrid projects={filteredProjects} onOpen={setSelectedProject} />
          </>
        ) : null}
      </main>

      <ProjectModal project={selectedProject} isOpen={Boolean(selectedProject)} onClose={() => setSelectedProject(null)} />
    </div>
  );
}

export default App;
