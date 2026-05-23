# Rafiq App

Expo Router starter for the Rafiq mobile app.

## Run locally

```bash
npm install
npm run start
```

## Current state

- Default Expo demo routes and modal flow removed.
- Expo Router files in `app/` are thin route entrypoints only.
- Application code now follows a feature-based structure under `src/`.

## Structure

```text
app/
├── app/                  # Expo Router route files only
├── src/
│   ├── app/              # app-level providers and composition
│   ├── features/         # feature modules
│   └── shared/           # shared hooks, theme, and UI
├── assets/
└── global.css
```

## Suggested next work

- Define the initial route map and authentication flow.
- Replace placeholder icons and splash assets with project branding.
- Add domain features and shared UI primitives incrementally.
