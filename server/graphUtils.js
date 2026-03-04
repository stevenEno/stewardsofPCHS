export function normalizeSubjectKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function indexSubjects(subjects) {
  const byName = new Map();
  const byKey = new Map();

  for (const subject of subjects) {
    byName.set(subject.name, subject);
    byKey.set(normalizeSubjectKey(subject.name), subject);
  }

  return { byName, byKey };
}

export function buildNodeMaps(subject) {
  const nodesById = new Map(subject.nodes.map((node) => [node.id, node]));
  const prereqByNode = new Map();
  const outByNode = new Map();

  for (const node of subject.nodes) {
    prereqByNode.set(node.id, []);
    outByNode.set(node.id, []);
  }

  for (const edge of subject.edges) {
    prereqByNode.get(edge.to).push(edge.from);
    outByNode.get(edge.from).push(edge.to);
  }

  return { nodesById, prereqByNode, outByNode };
}

export function validateSubjectGraph(subject) {
  const nodeIds = new Set(subject.nodes.map((node) => node.id));

  for (const edge of subject.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new Error(`Invalid edge in ${subject.name}: ${edge.from} -> ${edge.to}`);
    }
  }

  const inDegree = new Map(subject.nodes.map((node) => [node.id, 0]));
  const adj = new Map(subject.nodes.map((node) => [node.id, []]));

  for (const edge of subject.edges) {
    inDegree.set(edge.to, inDegree.get(edge.to) + 1);
    adj.get(edge.from).push(edge.to);
  }

  const queue = [];
  for (const [nodeId, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(nodeId);
  }

  let visited = 0;
  while (queue.length > 0) {
    const current = queue.shift();
    visited += 1;
    for (const next of adj.get(current)) {
      inDegree.set(next, inDegree.get(next) - 1);
      if (inDegree.get(next) === 0) queue.push(next);
    }
  }

  if (visited !== subject.nodes.length) {
    throw new Error(`Cycle detected in subject graph: ${subject.name}`);
  }
}

export function validateCrossLinks(subjects) {
  const subjectsByName = new Map(subjects.map((subject) => [subject.name, subject]));

  for (const subject of subjects) {
    for (const node of subject.nodes) {
      for (const link of node.crossLinks || []) {
        const targetSubject = subjectsByName.get(link.subject);
        if (!targetSubject) {
          throw new Error(
            `Invalid cross-link subject from ${subject.name}/${node.id}: ${link.subject}`
          );
        }
        const targetExists = targetSubject.nodes.some((targetNode) => targetNode.id === link.nodeId);
        if (!targetExists) {
          throw new Error(
            `Invalid cross-link node from ${subject.name}/${node.id}: ${link.subject}/${link.nodeId}`
          );
        }
      }
    }
  }
}

function collectPrerequisiteClosure(nodeId, prereqByNode, acc = new Set()) {
  const prereqs = prereqByNode.get(nodeId) || [];
  for (const prereq of prereqs) {
    if (!acc.has(prereq)) {
      acc.add(prereq);
      collectPrerequisiteClosure(prereq, prereqByNode, acc);
    }
  }
  return acc;
}

export function buildRecommendations(subject, masteredNodeIds = []) {
  const mastered = new Set(masteredNodeIds);
  const { nodesById, prereqByNode } = buildNodeMaps(subject);

  const nodes = subject.nodes.map((node) => {
    if (mastered.has(node.id)) {
      return { ...node, status: 'mastered', statusColor: '#22C55E' };
    }

    const prereqs = prereqByNode.get(node.id) || [];
    const unlocked = prereqs.every((prereq) => mastered.has(prereq));

    if (unlocked) {
      return { ...node, status: 'recommended', statusColor: '#FACC15' };
    }

    return { ...node, status: 'locked', statusColor: '#9CA3AF' };
  });

  const recommendedNodeIds = nodes
    .filter((node) => node.status === 'recommended')
    .map((node) => node.id);

  const highlightedNodeIds = new Set();
  for (const nodeId of recommendedNodeIds) {
    highlightedNodeIds.add(nodeId);
    collectPrerequisiteClosure(nodeId, prereqByNode, highlightedNodeIds);
  }

  const highlightedEdges = subject.edges.filter(
    (edge) => highlightedNodeIds.has(edge.from) && highlightedNodeIds.has(edge.to)
  );

  return {
    subject: subject.name,
    counts: {
      totalNodes: subject.nodes.length,
      mastered: nodes.filter((node) => node.status === 'mastered').length,
      recommended: nodes.filter((node) => node.status === 'recommended').length,
      locked: nodes.filter((node) => node.status === 'locked').length
    },
    nodes,
    edges: subject.edges,
    highlightedPath: {
      nodeIds: [...highlightedNodeIds],
      edges: highlightedEdges
    },
    stats: {
      masteredNodeIds: [...mastered],
      availableNow: recommendedNodeIds
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      algorithm: 'all-prereqs-mastered-topological-unlock'
    },
    _internal: { nodesById }
  };
}

export function resolveCrossLinks(subjectsIndex, sourceSubject, sourceNodeId) {
  const sourceNode = sourceSubject.nodes.find((node) => node.id === sourceNodeId);
  if (!sourceNode) {
    return null;
  }

  const links = (sourceNode.crossLinks || []).map((link) => {
    const targetSubject = subjectsIndex.byName.get(link.subject);
    const targetNode = targetSubject?.nodes.find((node) => node.id === link.nodeId);
    return {
      subject: link.subject,
      nodeId: link.nodeId,
      reason: link.reason,
      node: targetNode || null
    };
  });

  return {
    subject: sourceSubject.name,
    nodeId: sourceNode.id,
    nodeName: sourceNode.name,
    links
  };
}
