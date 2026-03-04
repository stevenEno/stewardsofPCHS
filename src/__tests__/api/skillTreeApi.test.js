/** @jest-environment node */

import {
  buildRecommendations,
  normalizeSubjectKey,
  resolveCrossLinks
} from '../../../server/graphUtils.js';
import { findSubject, loadSkillTreeData } from '../../../server/skillTreeStore.js';

describe('Skill tree API logic', () => {
  const data = loadSkillTreeData();

  test('subject lookup supports slug normalization', () => {
    const key = normalizeSubjectKey('Computer Science/Technology');
    expect(key).toBe('computer-science-technology');

    const subject = findSubject(data, key);
    expect(subject).not.toBeNull();
    expect(subject.name).toBe('Computer Science/Technology');
  });

  test('recommendations unlock nodes with all prerequisites mastered', () => {
    const math = findSubject(data, 'mathematics');

    const initial = buildRecommendations(math, []);
    const initialRoot = initial.nodes.find((node) => node.id === 'math-001');
    expect(initialRoot.status).toBe('recommended');

    const next = buildRecommendations(math, ['math-001']);
    const unlocked = next.nodes.find((node) => node.id === 'math-002');
    expect(unlocked.status).toBe('recommended');
  });

  test('cross-link resolver returns target nodes', () => {
    const math = findSubject(data, 'mathematics');
    const crosslinks = resolveCrossLinks(data.subjectIndex, math, 'math-002');

    expect(crosslinks).not.toBeNull();
    expect(crosslinks.links.length).toBeGreaterThan(0);
    expect(crosslinks.links[0].node).not.toBeNull();
  });
});
