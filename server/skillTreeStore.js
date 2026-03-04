import fs from 'node:fs';
import path from 'node:path';
import {
  indexSubjects,
  normalizeSubjectKey,
  validateCrossLinks,
  validateSubjectGraph
} from './graphUtils.js';

const dataPath = path.resolve(process.cwd(), 'data/skills/high_school_skill_tree.json');

export function loadSkillTreeData() {
  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
    throw new Error('Invalid skill tree data: subjects must be a non-empty array');
  }

  for (const subject of data.subjects) {
    if (!subject.name || !Array.isArray(subject.nodes) || !Array.isArray(subject.edges)) {
      throw new Error(`Invalid subject payload: ${JSON.stringify(subject.name || subject)}`);
    }
    validateSubjectGraph(subject);
  }

  validateCrossLinks(data.subjects);

  const subjectIndex = indexSubjects(data.subjects);

  return {
    ...data,
    subjectIndex
  };
}

export function findSubject(data, subjectParam) {
  if (!subjectParam) return null;

  return (
    data.subjectIndex.byName.get(subjectParam) ||
    data.subjectIndex.byKey.get(normalizeSubjectKey(subjectParam)) ||
    null
  );
}
