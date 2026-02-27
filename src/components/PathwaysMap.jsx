import { useMemo } from 'react';
import styles from '../styles/PathwaysMap.module.css';

const SVG_WIDTH = 1100;
const SVG_HEIGHT = 640;
const LEFT_X = 140;
const CENTER_X = 550;
const RIGHT_X = 960;

function curvePath(x1, y1, x2, y2) {
  const c1x = x1 + (x2 - x1) * 0.32;
  const c2x = x1 + (x2 - x1) * 0.72;
  return `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
}

function bucketByLabel(values) {
  const unique = [...new Set(values)];
  return unique.map((value, index) => ({
    value,
    y: 90 + (index * (SVG_HEIGHT - 180)) / Math.max(unique.length - 1, 1)
  }));
}

function PathwaysMap({ pathways, selectedPathId, onSelectPath, onReset }) {
  const layout = useMemo(() => {
    const leftBuckets = bucketByLabel(pathways.map((pathway) => pathway.origin));
    const rightBuckets = bucketByLabel(pathways.map((pathway) => pathway.destination));

    const leftLookup = Object.fromEntries(leftBuckets.map((bucket) => [bucket.value, bucket.y]));
    const rightLookup = Object.fromEntries(rightBuckets.map((bucket) => [bucket.value, bucket.y]));

    const laneOffsets = {};
    const laneStep = 6;

    const computedPaths = pathways.map((pathway) => {
      const leftKey = `L:${pathway.origin}`;
      const rightKey = `R:${pathway.destination}`;

      laneOffsets[leftKey] = (laneOffsets[leftKey] || 0) + 1;
      laneOffsets[rightKey] = (laneOffsets[rightKey] || 0) + 1;

      const leftOffset = (laneOffsets[leftKey] - 1) * laneStep - 8;
      const rightOffset = (laneOffsets[rightKey] - 1) * laneStep - 8;

      const leftY = leftLookup[pathway.origin] + leftOffset;
      const centerY = SVG_HEIGHT / 2;
      const rightY = rightLookup[pathway.destination] + rightOffset;

      return {
        ...pathway,
        leftY,
        centerY,
        rightY,
        leftCurve: curvePath(LEFT_X, leftY, CENTER_X, centerY),
        rightCurve: curvePath(CENTER_X, centerY, RIGHT_X, rightY)
      };
    });

    return { leftBuckets, rightBuckets, computedPaths };
  }, [pathways]);

  const selected = layout.computedPaths.find((pathway) => pathway.id === selectedPathId) || null;

  const shownPaths = selected ? [selected] : layout.computedPaths;

  return (
    <div className={styles.wrapper}>
      <div className={styles.chartPanel}>
        <div className={styles.legendRow}>
          <span><strong>Left:</strong> Elementary + Middle School origins</span>
          <span><strong>Center:</strong> Pacifica</span>
          <span><strong>Right:</strong> College + Career destinations</span>
        </div>

        <svg className={styles.svg} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} role="img" aria-label="Pathways visualization">
          <defs>
            <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c4a462" />
              <stop offset="50%" stopColor="#365f90" />
              <stop offset="100%" stopColor="#4a9c63" />
            </linearGradient>
          </defs>

          {layout.leftBuckets.map((bucket) => (
            <g key={`left-${bucket.value}`}>
              <circle cx={LEFT_X} cy={bucket.y} r="5" fill="#c4a462" />
              <text x={LEFT_X - 14} y={bucket.y + 4} textAnchor="end" className={styles.nodeText}>
                {bucket.value}
              </text>
            </g>
          ))}

          {layout.rightBuckets.map((bucket) => (
            <g key={`right-${bucket.value}`}>
              <circle cx={RIGHT_X} cy={bucket.y} r="5" fill="#4a9c63" />
              <text x={RIGHT_X + 14} y={bucket.y + 4} textAnchor="start" className={styles.nodeText}>
                {bucket.value}
              </text>
            </g>
          ))}

          <g>
            <rect x={CENTER_X - 68} y={SVG_HEIGHT / 2 - 44} width="136" height="88" rx="14" className={styles.centerBox} />
            <text x={CENTER_X} y={SVG_HEIGHT / 2 - 5} textAnchor="middle" className={styles.centerTextMain}>
              Pacifica
            </text>
            <text x={CENTER_X} y={SVG_HEIGHT / 2 + 18} textAnchor="middle" className={styles.centerTextSub}>
              Christian High School
            </text>
          </g>

          {shownPaths.map((pathway) => {
            const isActive = selectedPathId === pathway.id;
            return (
              <g key={pathway.id}>
                <path
                  d={pathway.leftCurve}
                  className={styles.flowPath}
                  style={{
                    opacity: selectedPathId && !isActive ? 0.15 : 0.55,
                    strokeWidth: isActive ? 4.2 : 2.1
                  }}
                />
                <path
                  d={pathway.rightCurve}
                  className={styles.flowPath}
                  style={{
                    opacity: selectedPathId && !isActive ? 0.15 : 0.55,
                    strokeWidth: isActive ? 4.2 : 2.1
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <aside className={styles.detailPanel}>
        <h3>{selected ? 'Focused Pathway' : 'Pathway Details'}</h3>
        <p>
          {selected
            ? 'Zoomed to one path. Review details below or reset to compare all flows.'
            : 'Select a path below to zoom in and view a specific student journey.'}
        </p>

        <div className={styles.pathList}>
          {layout.computedPaths.map((pathway) => {
            const isActive = selectedPathId === pathway.id;
            return (
              <button
                key={pathway.id}
                type="button"
                className={`${styles.pathButton} ${isActive ? styles.active : ''}`}
                onClick={() => onSelectPath(pathway.id)}
                aria-label={`Focus pathway for ${pathway.studentAlias}`}
              >
                <strong>{pathway.studentAlias}</strong>
                <span>{pathway.origin} {'->'} Pacifica {'->'} {pathway.destination}</span>
              </button>
            );
          })}
        </div>

        {selected ? (
          <article className={styles.storyCard}>
            <h4>{selected.studentAlias}</h4>
            <p><strong>Origin:</strong> {selected.originType} - {selected.origin} ({selected.neighborhood})</p>
            <p><strong>At Pacifica:</strong> {selected.pacificaProgram}</p>
            <p><strong>Next Step:</strong> {selected.destinationType} - {selected.destination}</p>
            <p><strong>Focus:</strong> {selected.postPacificaFocus}</p>
            <p>{selected.story}</p>
            <button type="button" className={styles.resetButton} onClick={onReset}>
              Reset to all pathways
            </button>
          </article>
        ) : null}
      </aside>
    </div>
  );
}

export default PathwaysMap;
