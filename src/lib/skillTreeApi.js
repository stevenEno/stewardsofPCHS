import axios from 'axios';
import { getConfig } from './runtimeConfig';

const API_BASE_URL = getConfig('VITE_SKILL_TREE_API_URL', '');

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

export function getApiBaseUrl() {
  return API_BASE_URL || '(same-origin /api)';
}

export async function fetchSubjects() {
  const response = await client.get('/api/subjects');
  return response.data.subjects || [];
}

export async function fetchSubjectTree(subjectKey) {
  const response = await client.get(`/api/subjects/${encodeURIComponent(subjectKey)}`);
  return response.data.subject;
}

export async function fetchRecommendations(userId, subjectKey) {
  const response = await client.get(
    `/api/recommendations/${encodeURIComponent(userId)}/${encodeURIComponent(subjectKey)}`
  );
  return response.data;
}

export async function updateMastery(userId, subjectKey, nodeId, mastered) {
  const response = await client.post(
    `/api/mastery/${encodeURIComponent(userId)}/${encodeURIComponent(subjectKey)}/${encodeURIComponent(nodeId)}`,
    { mastered }
  );
  return response.data;
}

export async function fetchCrossLinks(subjectKey, nodeId) {
  const response = await client.get(
    `/api/crosslink/${encodeURIComponent(subjectKey)}/${encodeURIComponent(nodeId)}`
  );
  return response.data;
}
