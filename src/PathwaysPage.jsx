import { useMemo, useState } from 'react';
import Header from './components/Header';
import PathwaysMap from './components/PathwaysMap';
import { pathways, pathwaysSummary } from './lib/pathwaysData';
import styles from './styles/PathwaysPage.module.css';

function PathwaysPage() {
  const [selectedPathId, setSelectedPathId] = useState('');
  const stats = useMemo(() => {
    const leftOrigins = new Set(pathways.map((item) => item.origin)).size;
    const rightOutcomes = new Set(pathways.map((item) => item.destination)).size;
    const careers = pathways.filter((item) => item.destinationType.toLowerCase().includes('career')).length;
    return {
      leftOrigins,
      rightOutcomes,
      careers
    };
  }, []);

  return (
    <>
      <Header currentPage="pathways" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Pathways of Pacifica</p>
          <h1>{pathwaysSummary.title}</h1>
          <p>{pathwaysSummary.subtitle}</p>

        <div className={styles.highlights}>
          {pathwaysSummary.highlights.map((item) => (
            <article key={item}>{item}</article>
          ))}
        </div>
        {pathwaysSummary.refreshedAt ? (
          <p className={styles.refreshed}>Last data refresh: {pathwaysSummary.refreshedAt}</p>
        ) : null}

          <div className={styles.stats}>
            <article>
              <span>{stats.leftOrigins}</span>
              <p>Origin Schools</p>
            </article>
            <article>
              <span>{pathways.length}</span>
              <p>Pathways Illustrated</p>
            </article>
            <article>
              <span>{stats.rightOutcomes}</span>
              <p>Destinations</p>
            </article>
            <article>
              <span>{stats.careers}</span>
              <p>Career Routes</p>
            </article>
          </div>
        </section>

      <PathwaysMap
        pathways={pathways}
        selectedPathId={selectedPathId}
        onSelectPath={setSelectedPathId}
        onReset={() => setSelectedPathId('')}
      />

      <section className={styles.sources} aria-label="Pacifica reference stories">
        <h2>Reference Stories</h2>
        <p>
          This visualization style and narrative framing are informed by Pacifica stories about neighborhood access,
          student formation, and post-graduation outcomes.
        </p>
        <ul>
          <li>
            <a
              href="https://www.pacificachristian.org/about/pacifica-stories/crafting-the-class-of-2030-a-certain-kind-of-person"
              target="_blank"
              rel="noreferrer"
            >
              Crafting the Class of 2030: A Certain Kind of Person
            </a>
          </li>
          <li>
            <a href="https://www.pacificachristian.org/about/from-all-neighborhoods" target="_blank" rel="noreferrer">
              From All Neighborhoods
            </a>
          </li>
          <li>
            <a
              href="https://www.pacificachristian.org/about/pacifica-stories/celebrating-more-college-acceptances"
              target="_blank"
              rel="noreferrer"
            >
              Celebrating More College Acceptances
            </a>
          </li>
        </ul>
      </section>
    </main>
  </>
  );
}

export default PathwaysPage;
