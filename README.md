# HIIT Timer

A minimal, mobile-first interval timer for HIIT workouts. Configure rounds,
exercises per round (or a named exercise list), work/rest durations, pick a
theme, and go. Installable as a PWA.

## Features

- **Two workout modes**: fixed number of rounds × exercises-per-round, or a
  named exercise list that repeats across rounds.
- **Configurable in 5s steps**: exercise duration, rest between exercises,
  rest between rounds.
- **Persisted setup**: your last configuration and theme are saved in a
  cookie and restored on next visit.
- **10 themes**, light and dark, switchable from a bottom sheet — colors are
  fully decoupled from the workout logic.
- **Bottom-to-top progress curtain** with 4 cosmetic textures (solid,
  stripes, waves, dots) that cycle independently of the theme.
- **Sound cues**: countdown beeps for the last 3 seconds and a completion
  chime, with a mute toggle.
- **Installable PWA**: manifest + service worker, with an in-app install
  button that appears when the browser supports it.
- Skip / pause / stop controls, screen wake lock while running.

## Development

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build locally
```

## Stack

Vite + React + TypeScript, no UI framework — plain CSS with custom
properties driving theming.

## Deploying

This is a standard Vite app — deploy `dist/` anywhere static, or connect
the repo to Vercel (framework preset: Vite, build command `npm run build`,
output directory `dist`).
