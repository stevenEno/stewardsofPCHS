# Skill Tree API

## Run

```bash
npm run api:dev
```

Server starts on `http://127.0.0.1:8080` by default.

## Data source

- `data/skills/high_school_skill_tree.json`

The server validates on startup:
- subject graph edges reference valid nodes
- each subject graph is acyclic
- cross-subject links reference existing target nodes

## Endpoints

### `GET /api/health`
Returns health status and subject count.

### `GET /api/subjects`
Returns subject summaries (`name`, `key`, `nodeCount`, `edgeCount`, `legend`).

### `GET /api/subjects/:subject`
Returns full skill tree for one subject.

- `:subject` supports exact name or slug key (example: `mathematics`, `computer-science-technology`).

### `POST /api/mastery/:userId/:subject/:nodeId`
Updates node mastery for a user.

Body:

```json
{ "mastered": true }
```

### `GET /api/recommendations/:userId/:subject`
Returns node statuses using prerequisite unlock rules:
- `mastered` (green)
- `recommended` (yellow)
- `locked` (gray)

Also returns highlighted prerequisite path data.

### `GET /api/crosslink/:subject/:nodeId`
Returns cross-subject linked nodes with reason metadata for graph jump navigation.

## Notes

- Mastery storage is currently in-memory (`Map`) for local/dev usage.
- For production, replace with persistent storage (Postgres/Redis) and authentication.
