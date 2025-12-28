# Repository Guidelines

## Project Structure & Module Organization
- `server.js` is the Express entrypoint and serves static assets from `public/`.
- `routes/api.js` holds the REST API for ratings and comments.
- `database/init.js` initializes SQLite and exposes prepared statements.
- `database/pokemon.db` is the local SQLite file (with `*.db-wal`/`*.db-shm`).
- `public/` contains the frontend HTML/CSS/JS assets.
- `spec.md` documents expected features and API behavior.

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm run dev` starts the server with auto-reload via nodemon.
- `npm start` runs the production server with Node.

## Coding Style & Naming Conventions
- JavaScript uses CommonJS (`require`, `module.exports`) and 4-space indentation.
- API payloads use snake_case keys (e.g., `pokemon_id`, `comment_text`); keep this consistent.
- Route files are singular and grouped by feature (ratings/comments) in `routes/`.

## Testing Guidelines
- No automated test framework is configured in `package.json`.
- Validate changes with manual API calls and UI checks (e.g., ratings, comments, delete).
- If adding tests, document the runner and add an `npm test` script.

## Commit & Pull Request Guidelines
- Recent commits use short, lowercase summaries (e.g., “cleaning up”); follow that style.
- PRs should include: a brief summary, testing steps (`npm run dev` + manual flow), and UI screenshots when frontend changes are made.
- Avoid committing unintended changes to `database/pokemon.db` unless the data update is required.

## Configuration & Data Notes
- The server listens on `PORT` (defaults to `3000`).
- The app relies on the public PokeAPI; handle network failures gracefully when testing.
