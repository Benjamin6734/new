const CACHE_NAME = 'mahudhurio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/register.html',
  '/students_table.html',
  '/monthly_report.html',
  '/export_report.html',
  '/majina.json',
  '/manifest.json', // Hakikisha manifest.json imo hapa
  '/rsz_capture.png', // Hakikisha aikoni imo hapa
  '/app.js' // Ikiwa una faili ya app.js
];

// Install event - cache everything
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => {
        // Fallback to index.html if offline and requested resource not in cache
        return caches.match('/index.html'); 
      });
    })
  );
});
