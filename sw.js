/**
 * Jyoti AI - Service Worker for 100% Offline Resilience
 * Zero external network dependency for core calculation & local reading.
 */
const CACHE_NAME = "jyoti-ai-v2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/styles.css",
  "./src/avatar.jpg",
  "./src/vedic-engine.js",
  "./src/cities.js",
  "./src/ai-service.js",
  "./src/chart-renderer.js",
  "./src/audio-ambient.js",
  "./src/card-generator.js",
  "./src/celebrities.js",
  "./src/aura-meter.js",
  "./src/house-details.js",
  "./src/tarot-engine.js",
  "./src/voice-engine.js",
  "./src/i18n.js",
  "./src/rashifal-engine.js",
  "./src/gemstone-engine.js",
  "./src/streak-engine.js",
  "./src/call-engine.js",
  "./src/pwa-install.js",
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
  // Only handle local GET requests (avoids breaking POST to Gemini / Groq)
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => cached))
  );
});
