import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Only register the service worker in production builds. In dev, it caches
// the HTML shell/modules and starts serving stale content on every reload,
// which fights with Vite's HMR and looks like "a different app" is loaded.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Non-critical: app still works without offline support.
    })
  })
}
