import { useEffect, useMemo, useRef } from 'react';
import cytoscape from 'cytoscape';
import styles from '../styles/SkillTreeGraph.module.css';

const IS_TEST = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

function edgeKey(from, to) {
  return `${from}->${to}`;
}

function buildElements(nodes, edges) {
  const nodeElements = (nodes || []).map((node) => ({
    data: {
      id: node.id,
      label: node.name,
      statusColor: node.statusColor || '#9CA3AF'
    }
  }));

  const edgeElements = (edges || []).map((edge) => ({
    data: {
      id: edgeKey(edge.from, edge.to),
      source: edge.from,
      target: edge.to
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

function SkillTreeGraph({ nodes = [], edges = [], selectedNodeId = '', onSelectNode }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

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
            'background-color': 'data(statusColor)',
            label: 'data(label)',
            color: '#16253a',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 130,
            'text-valign': 'center',
            'text-halign': 'center',
            'border-width': 1,
            'border-color': '#2f4058',
            width: 58,
            height: 58
          }
        },
        {
          selector: 'edge',
          style: {
            width: 2,
            'line-color': '#9fb0c4',
            'target-arrow-color': '#9fb0c4',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
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
            width: 4
          }
        },
        {
          selector: '.dim',
          style: {
            opacity: 0.25
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 24,
        spacingFactor: 1.25,
        animate: false
      }
    });

    cy.on('tap', 'node', (event) => {
      const id = event.target.id();
      if (onSelectNode) {
        onSelectNode(id);
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [elements, onSelectNode]);

  useEffect(() => {
    const cy = cyRef.current;
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
      if (!visibleNodeIds.has(node.id())) {
        node.addClass('dim');
      }
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
      cy.animate({
        fit: { eles: cy.collection().merge(selectedNode), padding: 45 },
        duration: 220
      });
    }
  }, [selectedNodeId, edges]);

  return <div ref={containerRef} className={styles.graph} aria-label="Skill tree graph" />;
}

export default SkillTreeGraph;
