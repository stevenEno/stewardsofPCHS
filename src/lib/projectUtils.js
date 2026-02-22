/**
 * Picks a random project from a list. If the list is empty, returns null.
 */
export function pickRandomProject(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * projects.length);
  return projects[index];
}

/**
 * Normalizes user text for robust search matching.
 */
export function normalizeText(value) {
  return (value || '').toLowerCase().trim();
}

/**
 * Filters project items by project name or student name.
 */
export function filterProjects(projects, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return projects;
  }

  return projects.filter((project) => {
    const searchable = `${project.name} ${project.studentName}`.toLowerCase();
    return searchable.includes(normalizedQuery);
  });
}
