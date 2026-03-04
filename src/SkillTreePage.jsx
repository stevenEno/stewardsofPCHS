import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import {
  fetchCrossLinks,
  fetchRecommendations,
  fetchSubjects,
  fetchSubjectTree,
  getApiBaseUrl,
  updateMastery
} from './lib/skillTreeApi';
import styles from './styles/SkillTreePage.module.css';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function statusClass(status) {
  if (status === 'mastered') return styles.statusMastered;
  if (status === 'recommended') return styles.statusRecommended;
  return styles.statusLocked;
}

function SkillTreePage() {
  const [subjects, setSubjects] = useState([]);
  const [subjectKey, setSubjectKey] = useState('mathematics');
  const [userId, setUserId] = useState('demo-student');
  const [subjectTree, setSubjectTree] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const [crosslinkData, setCrosslinkData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const selectedNode = useMemo(() => {
    if (!recommendation || !selectedNodeId) return null;
    return recommendation.nodes.find((node) => node.id === selectedNodeId) || null;
  }, [recommendation, selectedNodeId]);

  async function reloadSubjectData(nextSubjectKey, nextUserId, preserveSelected = false) {
    setIsLoading(true);
    setError('');

    try {
      const [subject, rec] = await Promise.all([
        fetchSubjectTree(nextSubjectKey),
        fetchRecommendations(nextUserId, nextSubjectKey)
      ]);

      setSubjectTree(subject);
      setRecommendation(rec);

      if (preserveSelected && selectedNodeId && rec.nodes.some((node) => node.id === selectedNodeId)) {
        setSelectedNodeId(selectedNodeId);
      } else {
        setSelectedNodeId(rec.nodes[0]?.id || '');
      }
    } catch (loadError) {
      setError(
        `Unable to load skill tree data from ${getApiBaseUrl()}. Start the API with \"npm run api:dev\" and retry.`
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const subjectList = await fetchSubjects();
        if (!active) return;

        setSubjects(subjectList);
        const first = subjectList[0]?.key || 'mathematics';
        setSubjectKey(first);
        await reloadSubjectData(first, userId);
      } catch (loadError) {
        if (active) {
          setError(
            `Unable to load skill tree data from ${getApiBaseUrl()}. Start the API with \"npm run api:dev\" and retry.`
          );
          setIsLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCrossLinks() {
      if (!selectedNodeId || !subjectKey) {
        setCrosslinkData(null);
        return;
      }

      try {
        const data = await fetchCrossLinks(subjectKey, selectedNodeId);
        if (!active) return;
        setCrosslinkData(data);
      } catch {
        if (active) {
          setCrosslinkData({ links: [] });
        }
      }
    }

    loadCrossLinks();

    return () => {
      active = false;
    };
  }, [selectedNodeId, subjectKey]);

  async function onRefresh() {
    await reloadSubjectData(subjectKey, userId, true);
  }

  async function onToggleMastery(node) {
    if (!node || isUpdating) return;

    setIsUpdating(true);
    setError('');
    try {
      await updateMastery(userId, subjectKey, node.id, node.status !== 'mastered');
      await reloadSubjectData(subjectKey, userId, true);
    } catch {
      setError('Failed to update mastery. Please retry.');
    } finally {
      setIsUpdating(false);
    }
  }

  async function onJumpCrossLink(link) {
    if (!link?.subject || !link?.nodeId) return;

    const targetKey = slugify(link.subject);
    setSubjectKey(targetKey);
    await reloadSubjectData(targetKey, userId);
    setSelectedNodeId(link.nodeId);
  }

  const counts = recommendation?.counts || { totalNodes: 0, mastered: 0, recommended: 0, locked: 0 };

  return (
    <>
      <Header currentPage="skilltree" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Knowledge Graph Lab</p>
          <h1>High School Skill Tree Explorer</h1>
          <p>
            Test subject graphs, mastery tracking, recommendations, and cross-subject jumps from the Stewards of PCHS
            site.
          </p>
        </section>

        <section className={styles.controls}>
          <label>
            Subject
            <select
              value={subjectKey}
              onChange={(event) => {
                const next = event.target.value;
                setSubjectKey(next);
                reloadSubjectData(next, userId);
              }}
            >
              {subjects.map((subject) => (
                <option key={subject.key} value={subject.key}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Student ID
            <input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="demo-student" />
          </label>

          <button type="button" onClick={onRefresh} disabled={isLoading || !userId.trim()}>
            Refresh Recommendations
          </button>
        </section>

        {error ? <p className={styles.error}>{error}</p> : null}

        <section className={styles.metrics}>
          <article>
            <span>{counts.totalNodes}</span>
            <p>Total Nodes</p>
          </article>
          <article>
            <span>{counts.mastered}</span>
            <p>Mastered</p>
          </article>
          <article>
            <span>{counts.recommended}</span>
            <p>Recommended</p>
          </article>
          <article>
            <span>{counts.locked}</span>
            <p>Locked</p>
          </article>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>Nodes</h2>
            {isLoading ? <p>Loading subject data...</p> : null}
            {!isLoading ? (
              <ul className={styles.nodeList}>
                {(recommendation?.nodes || []).map((node) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      className={`${styles.nodeButton} ${statusClass(node.status)} ${
                        selectedNodeId === node.id ? styles.nodeSelected : ''
                      }`}
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      <span className={styles.nodeTitle}>{node.name}</span>
                      <span className={styles.nodeMeta}>
                        {node.id} | {node.level}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>

          <article className={styles.card}>
            <h2>Node Details</h2>
            {!selectedNode ? <p>Select a node to inspect details.</p> : null}
            {selectedNode ? (
              <div className={styles.details}>
                <h3>{selectedNode.name}</h3>
                <p>{selectedNode.description}</p>
                <p>
                  <strong>Status:</strong> {selectedNode.status}
                </p>
                <p>
                  <strong>Level:</strong> {selectedNode.level}
                </p>
                <button type="button" disabled={isUpdating} onClick={() => onToggleMastery(selectedNode)}>
                  {selectedNode.status === 'mastered' ? 'Mark Not Mastered' : 'Mark Mastered'}
                </button>

                <h4>Resources</h4>
                <ul>
                  {(selectedNode.resources || []).map((resource) => (
                    <li key={resource}>
                      <a href={resource} target="_blank" rel="noreferrer">
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>

                <h4>Cross-Subject Links</h4>
                {crosslinkData?.links?.length ? (
                  <ul>
                    {crosslinkData.links.map((link) => (
                      <li key={`${link.subject}-${link.nodeId}`}>
                        <button type="button" className={styles.linkButton} onClick={() => onJumpCrossLink(link)}>
                          {link.subject}: {link.node?.name || link.nodeId}
                        </button>
                        <p>{link.reason}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No cross-subject links for this node.</p>
                )}
              </div>
            ) : null}
          </article>
        </section>

        <section className={styles.footerNote}>
          <p>
            API endpoint: <code>{getApiBaseUrl()}</code>
          </p>
          <p>
            Selected subject: <strong>{subjectTree?.name || 'N/A'}</strong>
          </p>
        </section>
      </main>
    </>
  );
}

export default SkillTreePage;
