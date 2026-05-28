import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global error handlers for debugging white screen
window.addEventListener('error', (e) => {
  console.error('Uncaught error:', e.error, 'at', e.filename + ':' + e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// ── Service Worker Registration with auto-update ──────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('[SW] Registered:', registration.scope);

      // Check for update every 60 seconds
      setInterval(() => registration.update(), 60_000);

      // When a new SW is waiting, activate it immediately and reload
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New version ready — reloading...');
            newWorker.postMessage('SKIP_WAITING');
          }
        });
      });
    }).catch((err) => {
      console.warn('[SW] Registration failed (non-critical):', err);
    });

    // When SW takes control after update, reload once
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}
