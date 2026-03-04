import { useEffect, useMemo, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import styles from '../styles/SkillTreeGraph.module.css';

cytoscape.use(dagre);

const IS_TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

function edgeKey(from, to) {
  return `${from}->${to}`;
}

function buildElements(nodes, edges) {
  const nodeElements = (nodes || []).map((node) => ({
    data: {
      id: node.id,
      label: node.name,
      shortLabel: node.id,
      status: node.status || 'locked',
      baseColor: node.color || '#D1D5DB'
    }
  }));

  const edgeElements = (edges || []).map((edge, index) => ({
    data: {
      id: edgeKey(edge.from, edge.to),
      source: edge.from,
      target: edge.to,
      bend: (index % 5) - 2
    }
  }));

  return [...nodeElements, ...edgeElements];
}

function collectPrerequisites(nodeId, edges) {
  const incoming = new Map();
  for (const edge of edges || []) {
    const list = incoming.get(edge.to) || [];
    list.push(edge.from);
    incoming.set(edge.to, list);
  }

  const visited = new Set();
  const stack = [nodeId];

  while (stack.length > 0) {
    const current = stack.pop();
    const prereqs = incoming.get(current) || [];
    for (const prereq of prereqs) {
      if (!visited.has(prereq)) {
        visited.add(prereq);
        stack.push(prereq);
      }
    }
  }

  return visited;
}

function layoutOptions() {
  return {
    name: 'dagre',
    rankDir: 'LR',
    rankSep: 82,
    nodeSep: 18,
    edgeSep: 12,
    ranker: 'network-simplex',
    padding: 20,
    animate: false
  };
}

function SkillTreeGraph({ nodes = [], edges = [], selectedNodeId = '', onSelectNode }) {
  const containerRef = useRef(null);
  const miniMapRef = useRef(null);
  const cyRef = useRef(null);
  const miniCyRef = useRef(null);

  const elements = useMemo(() => buildElements(nodes, edges), [nodes, edges]);

  useEffect(() => {
    if (!containerRef.current || elements.length === 0) {
      return undefined;
    }

    const cy = cytoscape({
      container: IS_TEST ? undefined : containerRef.current,
      headless: IS_TEST,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(baseColor)',
            label: 'data(label)',
            color: '#0f172a',
            'font-size': 8,
            'text-wrap': 'wrap',
            'text-max-width': 86,
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': 1.5,
            'border-color': '#334155',
            width: 32,
            height: 32
          }
        },
        {
          selector: 'node[status = "mastered"]',
          style: {
            'border-color': '#15803D',
            'border-width': 3.5
          }
        },
        {
          selector: 'node[status = "recommended"]',
          style: {
            'border-color': '#CA8A04',
            'border-width': 3.5
          }
        },
        {
          selector: 'edge',
          style: {
            width: 1.2,
            'line-color': '#9fb0c4',
            'target-arrow-color': '#9fb0c4',
            'target-arrow-shape': 'triangle',
            'curve-style': 'unbundled-bezier',
            'control-point-distances': 'data(bend)',
            'control-point-weights': 0.5,
            opacity: 0.75
          }
        },
        {
          selector: '.selected',
          style: {
            'border-width': 4,
            'border-color': '#111827'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'line-color': '#1f3f67',
            'target-arrow-color': '#1f3f67',
            width: 2.8,
            opacity: 1
          }
        },
        {
          selector: '.dim',
          style: {
            opacity: 0.12
          }
        }
      ],
      layout: layoutOptions()
    });

    cy.on('tap', 'node', (event) => {
      const id = event.target.id();
      if (onSelectNode) onSelectNode(id);
    });

    cyRef.current = cy;

    if (!IS_TEST && miniMapRef.current) {
      const mini = cytoscape({
        container: miniMapRef.current,
        elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#94a3b8',
              width: 7,
              height: 7,
              label: ''
            }
          },
          {
            selector: 'edge',
            style: {
              width: 0.5,
              'line-color': '#cbd5e1',
              'target-arrow-shape': 'none',
              'curve-style': 'straight'
            }
          }
        ],
        layout: layoutOptions(),
        userZoomingEnabled: false,
        userPanningEnabled: false,
        boxSelectionEnabled: false,
        autoungrabify: true,
        autounselectify: true
      });
      miniCyRef.current = mini;
    }

    return () => {
      cy.destroy();
      cyRef.current = null;
      if (miniCyRef.current) {
        miniCyRef.current.destroy();
        miniCyRef.current = null;
      }
    };
  }, [elements, onSelectNode]);

  useEffect(() => {
    if (IS_TEST) return undefined;
    const cy = cyRef.current;
    if (!cy) return;

    const syncLabels = () => {
      const z = cy.zoom();
      if (z < 0.45) {
        cy.style().selector('node').style('label', '').update();
      } else if (z < 0.8) {
        cy.style().selector('node').style('label', 'data(shortLabel)').update();
      } else {
        cy.style().selector('node').style('label', 'data(label)').update();
      }
    };

    syncLabels();
    cy.on('zoom', syncLabels);

    return () => {
      cy.removeListener('zoom', syncLabels);
    };
  }, [elements]);

  useEffect(() => {
    const cy = cyRef.current;
    const mini = miniCyRef.current;
    if (!cy) return;

    cy.nodes().removeClass('selected dim');
    cy.edges().removeClass('highlighted dim');

    if (!selectedNodeId) {
      return;
    }

    const selectedNode = cy.getElementById(selectedNodeId);
    if (!selectedNode || selectedNode.empty()) {
      return;
    }

    selectedNode.addClass('selected');

    const prereqNodes = collectPrerequisites(selectedNodeId, edges);
    const visibleNodeIds = new Set([selectedNodeId, ...prereqNodes]);

    cy.nodes().forEach((node) => {
      if (!visibleNodeIds.has(node.id())) node.addClass('dim');
    });

    cy.edges().forEach((edge) => {
      const source = edge.source().id();
      const target = edge.target().id();
      if (visibleNodeIds.has(source) && visibleNodeIds.has(target)) {
        edge.addClass('highlighted');
      } else {
        edge.addClass('dim');
      }
    });

    if (!IS_TEST) {
      cy.animate({ fit: { eles: cy.elements(), padding: 30 }, duration: 100 });
      cy.animate({ center: { eles: selectedNode }, zoom: Math.max(cy.zoom(), 0.72), duration: 180 });

      if (mini) {
        mini.nodes().removeClass('selected');
        const miniNode = mini.getElementById(selectedNodeId);
        if (miniNode && !miniNode.empty()) {
          miniNode.addClass('selected');
          mini.style().selector('.selected').style('background-color', '#1e3a8a').update();
        }
      }
    }
  }, [selectedNodeId, edges]);

  return (
    <div className={styles.shell}>
      <div ref={containerRef} className={styles.graph} aria-label="Skill tree graph" />
      {!IS_TEST ? (
        <div className={styles.miniPanel}>
          <p>Mini-map</p>
          <div ref={miniMapRef} className={styles.minimap} aria-label="Graph mini-map" />
        </div>
      ) : null}
    </div>
  );
}

export default SkillTreeGraph;
