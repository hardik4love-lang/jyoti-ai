/**
 * Jyoti AI - Service Worker for 100% Offline Resilience
 * Zero external network dependency for core calculation & local reading.
 */
const CACHE_NAME = "jyoti-ai-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/styles.css",
  "./src/vedic-engine.js",
  "./src/cities.js",
  "./src/ai-service.js",
  "./src/chart-renderer.js",
  "./src/audio-ambient.js",
  "./src/app.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => cached))
  );
});
