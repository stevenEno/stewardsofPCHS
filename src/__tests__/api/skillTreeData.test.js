/** @jest-environment node */

import { loadSkillTreeData } from '../../../server/skillTreeStore.js';

describe('Skill tree data integrity', () => {
  test('loads with valid DAGs and cross-links', () => {
    const data = loadSkillTreeData();

    expect(data.subjects.length).toBeGreaterThan(0);

    for (const subject of data.subjects) {
      const ids = new Set(subject.nodes.map((node) => node.id));
      expect(ids.size).toBe(subject.nodes.length);

      for (const edge of subject.edges) {
        expect(ids.has(edge.from)).toBe(true);
        expect(ids.has(edge.to)).toBe(true);
      }
    }
  });
});
