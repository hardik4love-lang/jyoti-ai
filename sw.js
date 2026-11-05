/**
 * Jyoti AI - Service Worker for 100% Offline Resilience
 * Zero external network dependency for core calculation & local reading.
 */
const CACHE_NAME = "jyoti-ai-v9";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./src/styles.css",
  "./src/avatar.jpg",
  "./src/jyoti-idle.mp4",
  "./src/jyoti-talking.mp4",
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
  "./src/video-call-engine.js",
  "./src/battery-engine.js",
  "./src/countdown-engine.js",
  "./src/pwa-install.js",
  "./src/temple-bell.js",
  "./src/profile-manager.js",
  "./src/report-generator.js",
  "./src/qr-generator.js",
  "./src/synastry-link.js",
  "./src/redflag-engine.js",
  "./src/yantra-scanner.js",
  "./src/prashna-engine.js",
  "./src/radar-engine.js",
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

  // Network-First with Cache Fallback for instant updates & offline resilience
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
