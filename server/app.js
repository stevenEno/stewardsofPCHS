import express from 'express';
import { buildRecommendations, resolveCrossLinks } from './graphUtils.js';
import { findSubject, loadSkillTreeData } from './skillTreeStore.js';

export function createApp({ skillTreeData = loadSkillTreeData() } = {}) {
  const app = express();
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    return next();
  });
  app.use(express.json());

  const masteryStore = new Map();

  function getUserSubjectMastery(userId, subjectName) {
    const userMap = masteryStore.get(userId) || new Map();
    if (!masteryStore.has(userId)) masteryStore.set(userId, userMap);

    const subjectSet = userMap.get(subjectName) || new Set();
    if (!userMap.has(subjectName)) userMap.set(subjectName, subjectSet);

    return subjectSet;
  }

  app.get('/api/subjects', (req, res) => {
    const subjects = skillTreeData.subjects.map((subject) => ({
      name: subject.name,
      key: subject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      nodeCount: subject.nodes.length,
      edgeCount: subject.edges.length,
      legend: subject.legend
    }));
    res.json({ subjects });
  });

  app.get('/api/subjects/:subject', (req, res) => {
    const subject = findSubject(skillTreeData, req.params.subject);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    return res.json({ subject });
  });

  app.post('/api/mastery/:userId/:subject/:nodeId', (req, res) => {
    const { userId, subject: subjectParam, nodeId } = req.params;
    const subject = findSubject(skillTreeData, subjectParam);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const nodeExists = subject.nodes.some((node) => node.id === nodeId);
    if (!nodeExists) {
      return res.status(404).json({ error: 'Node not found in subject' });
    }

    const { mastered } = req.body || {};
    if (typeof mastered !== 'boolean') {
      return res.status(400).json({ error: 'Request body must include boolean "mastered"' });
    }

    const subjectMastery = getUserSubjectMastery(userId, subject.name);
    if (mastered) {
      subjectMastery.add(nodeId);
    } else {
      subjectMastery.delete(nodeId);
    }

    return res.json({
      userId,
      subject: subject.name,
      nodeId,
      mastered,
      masteredNodeIds: [...subjectMastery],
      updatedAt: new Date().toISOString()
    });
  });

  app.get('/api/recommendations/:userId/:subject', (req, res) => {
    const { userId, subject: subjectParam } = req.params;
    const subject = findSubject(skillTreeData, subjectParam);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const masteredNodeIds = [...getUserSubjectMastery(userId, subject.name)];
    const recommendation = buildRecommendations(subject, masteredNodeIds);
    delete recommendation._internal;

    return res.json(recommendation);
  });

  app.get('/api/crosslink/:subject/:nodeId', (req, res) => {
    const { subject: subjectParam, nodeId } = req.params;
    const subject = findSubject(skillTreeData, subjectParam);

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const crosslink = resolveCrossLinks(skillTreeData.subjectIndex, subject, nodeId);

    if (!crosslink) {
      return res.status(404).json({ error: 'Node not found in subject' });
    }

    return res.json(crosslink);
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      subjects: skillTreeData.subjects.length,
      timestamp: new Date().toISOString()
    });
  });

  return app;
}
