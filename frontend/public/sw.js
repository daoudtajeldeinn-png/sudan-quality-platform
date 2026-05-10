// Sudan Quality Platform — Service Worker v4
// Strategy: Network-first for app shell, Cache-first for static assets

const CACHE_VERSION = 'sqp-v4';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json'
];

// ─── INSTALL: pre-cache app shell ───────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v4...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    }).then(() => {
      // Take control immediately without waiting for old SW to die
      return self.skipWaiting();
    })
  );
});

// ─── ACTIVATE: delete old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v4, clearing old caches...');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      // Take control of all open tabs immediately
      return self.clients.claim();
    })
  );
});

// ─── FETCH: smart caching strategy ──────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and API calls — always go to network for these
  if (request.method !== 'GET') return;
  if (url.hostname.includes('vercel.app') || url.hostname.includes('firebaseio.com')) return;
  if (url.pathname.startsWith('/api/')) return;

  // HTML navigation: Network-first (always get fresh app shell)
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            // Cache the fresh response
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: serve from cache
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // JS/CSS: Network-first with cache fallback
  if (url.pathname.match(/\.(js|css)$/)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Images/fonts: Cache-first (rarely change, save bandwidth on mobile)
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: Network with dynamic cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ─── MESSAGE: force update from UI ──────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
