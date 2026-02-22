import axios from 'axios';
import { getConfig } from './runtimeConfig';

const API_BASE = 'https://api.github.com';
const DEFAULT_OWNER = getConfig('VITE_GITHUB_OWNER', 'steveneno');
const DEFAULT_REPO = getConfig('VITE_GITHUB_REPO', 'stewardsofPCHS');
const DEFAULT_BRANCH = getConfig('VITE_GITHUB_BRANCH', 'main');
const CACHE_TTL_MS = 1000 * 60 * 10;

/**
 * Parses the base64 JSON payload returned by GitHub's contents API.
 */
export function parseProjectMetadata(contentBase64) {
  const decoded = atob((contentBase64 || '').replace(/\n/g, ''));
  return JSON.parse(decoded);
}

/**
 * Converts one project folder API response into the app project shape.
 */
export function mapProjectPayload(slug, metadata, files) {
  const thumbnail = files.find((file) => /^thumbnail\.(png|jpe?g|webp)$/i.test(file.name));
  const demo = files.find((file) => /^demo\.mp4$/i.test(file.name));

  return {
    slug,
    name: metadata.name || slug,
    description: metadata.description || 'No description provided yet.',
    studentName: metadata.studentName || 'Unknown Student',
    githubLink: metadata.githubLink || '',
    thumbnailUrl: thumbnail?.download_url || '',
    demoVideoUrl: demo?.download_url || ''
  };
}

function getCacheKey(owner, repo, branch) {
  return `projects-cache:${owner}/${repo}@${branch}`;
}

function getCachedProjects(owner, repo, branch) {
  const key = getCacheKey(owner, repo, branch);
  const raw = sessionStorage.getItem(key);

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw);
  // TTL avoids stale data while still reducing repeated API requests.
  const isFresh = Date.now() - parsed.timestamp < CACHE_TTL_MS;
  return isFresh ? parsed.data : null;
}

function setCachedProjects(owner, repo, branch, data) {
  const key = getCacheKey(owner, repo, branch);
  sessionStorage.setItem(
    key,
    JSON.stringify({
      timestamp: Date.now(),
      data
    })
  );
}

/**
 * Reads all folders under /projects in the target GitHub repository and builds
 * a list of display-ready project objects.
 */
export async function fetchProjectsFromGitHub({
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
  branch = DEFAULT_BRANCH
} = {}) {
  const cached = getCachedProjects(owner, repo, branch);
  if (cached) {
    return cached;
  }

  const folderResponse = await axios.get(
    `${API_BASE}/repos/${owner}/${repo}/contents/projects`,
    {
      params: { ref: branch },
      headers: {
        Accept: 'application/vnd.github+json'
      }
    }
  );

  const projectDirs = folderResponse.data.filter((item) => item.type === 'dir');

  const projects = await Promise.all(
    projectDirs.map(async (dir) => {
      // Fetch metadata and asset listing in parallel for faster load times.
      const [metadataResponse, filesResponse] = await Promise.all([
        axios.get(
          `${API_BASE}/repos/${owner}/${repo}/contents/projects/${dir.name}/project.json`,
          {
            params: { ref: branch },
            headers: {
              Accept: 'application/vnd.github+json'
            }
          }
        ),
        axios.get(`${API_BASE}/repos/${owner}/${repo}/contents/projects/${dir.name}`, {
          params: { ref: branch },
          headers: {
            Accept: 'application/vnd.github+json'
          }
        })
      ]);

      const metadata = parseProjectMetadata(metadataResponse.data.content);
      return mapProjectPayload(dir.name, metadata, filesResponse.data);
    })
  );

  // Only expose project cards that can actually render media.
  const validProjects = projects.filter((project) => project.name && project.thumbnailUrl && project.demoVideoUrl);
  setCachedProjects(owner, repo, branch, validProjects);
  return validProjects;
}
