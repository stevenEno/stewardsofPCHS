# Stewards of PCHS - Student Projects Showcase

A React + Vite web app that showcases student projects and teaches a GitHub-first workflow.

## What this site does

- Fetches project folders from GitHub dynamically at runtime.
- Randomly highlights one project in a full-width hero section on each refresh.
- Shows all projects in a responsive masonry thumbnail grid.
- Opens a modal with project video, full description, student name, and GitHub link.
- Supports project search by project name or student.
- Includes a sample preview mode so the full UI can be reviewed before live GitHub projects are available.

## Stack

- React 18 + Vite
- Axios (GitHub REST API requests)
- react-modal (accessible modal)
- masonry-layout (thumbnail wall layout)
- Jest + Testing Library (unit/integration tests)
- Cypress (E2E)

## Project structure

```text
/projects/
  project-slug/
    project.json
    demo.mp4
    thumbnail.jpg
    (project source files)
/src/
  components/
  lib/
  styles/
  __tests__/
/.github/workflows/
```

## Student contribution workflow

1. Fork this repository on GitHub.
2. Clone your fork locally.
3. Create a branch for your work:
   `git checkout -b add-my-project`
4. Create a new folder under `/projects/`:
   `/projects/my-project-slug/`
5. Add required files:
   - `project.json`
   - `demo.mp4`
   - `thumbnail.jpg`
   - Your source files
6. Commit and push:
   `git add . && git commit -m "Add my project" && git push origin add-my-project`
7. Open a Pull Request from your branch into this repo's `main` branch.
8. Instructor reviews and merges manually.
9. On merge, Vercel auto-deploys the updated site.

### `project.json` schema

```json
{
  "name": "Your Project Name",
  "description": "What your project does.",
  "studentName": "Your Name",
  "githubLink": "https://github.com/your-username/stewardsofPCHS/pull/123"
}
```

## Create your demo video and thumbnail

### Option A: screen recorder + FFmpeg (recommended)

1. Record your app running.
2. Export `recording.mp4`.
3. Trim to 5-7 seconds:

```bash
ffmpeg -i recording.mp4 -t 7 -an -movflags +faststart demo.mp4
```

4. Create thumbnail from first frame:

```bash
ffmpeg -i demo.mp4 -vf "select=eq(n\,0)" -q:v 3 thumbnail.jpg
```

### Option B: screenshot tool

- Pause your app at a good frame.
- Save a `.jpg` or `.png` screenshot as `thumbnail.jpg`.

## Local development

Install dependencies and run the app:

```bash
npm install
npm run dev
```

If live GitHub project loading is unavailable, the app automatically switches to sample preview data.  
You can also manually toggle between **Preview Sample Data** and **Switch To Live Data** from the header.

Build and preview production output:

```bash
npm run build
npm run preview
```

## Environment configuration (optional)

Set these environment variables if your GitHub repo owner/name differ from defaults:

- `VITE_GITHUB_OWNER`
- `VITE_GITHUB_REPO`
- `VITE_GITHUB_BRANCH`
- `VITE_GITHUB_REPO_URL`

## Deployment on Vercel

1. Push this project to GitHub.
2. In Vercel, click **Add New Project**.
3. Import this GitHub repo.
4. Keep defaults (`npm install`, `npm run build`, output `dist`).
5. Confirm auto-deploys are enabled for `main`.
6. Merge PRs into `main` to trigger production deploys automatically.

`vercel.json` is included for SPA rewrite support.

## Optional GitHub Action: auto-generate demo videos for web projects

A starter workflow is included at `.github/workflows/optional-generate-demos.yml`.

- Trigger: push to `main` affecting `projects/**`.
- Intended behavior: find web projects and auto-generate `demo.mp4` + `thumbnail.jpg`.
- This workflow is a template starter and may need tuning for your project runtime.

## Testing

Run Jest unit/integration tests:

```bash
npm test
```

Run Cypress E2E tests (requires app running):

```bash
npm run dev
npm run cypress
```

Test outcomes are recorded in `tests/results.md`.
