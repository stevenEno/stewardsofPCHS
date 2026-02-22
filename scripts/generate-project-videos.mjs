/**
 * Optional helper script for CI.
 *
 * This starter detects web projects (folder contains index.html) and reports
 * candidate folders for automated capture. Replace the TODO section with your
 * own project-specific recording flow if you want fully automated MP4 creation.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, 'projects');

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  const candidates = [];
  for (const slug of folders) {
    const folder = path.join(PROJECTS_DIR, slug);
    const hasIndex = await exists(path.join(folder, 'index.html'));
    const hasDemo = await exists(path.join(folder, 'demo.mp4'));
    const hasThumbnail = await exists(path.join(folder, 'thumbnail.jpg'));

    if (hasIndex && (!hasDemo || !hasThumbnail)) {
      candidates.push(slug);
    }
  }

  if (candidates.length === 0) {
    console.log('No web projects need generated media.');
    return;
  }

  console.log('Candidates that need auto-generated media:');
  for (const slug of candidates) {
    console.log(`- ${slug}`);
  }

  // TODO: Add Puppeteer + FFmpeg capture pipeline for each candidate folder.
  // Suggested approach:
  // 1) Serve each project folder locally (e.g. with `npx serve`).
  // 2) Use Puppeteer to open the page and run scripted interactions.
  // 3) Record 5-7 seconds to MP4 and save as demo.mp4.
  // 4) Extract first frame as thumbnail.jpg.
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
