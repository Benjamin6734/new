const CACHE_NAME = 'mahudhurio-cache-v1';
const urlsToCache = [
  '/', // Muhimu sana kwa mizizi ya tovuti
  '/index.html',
  '/dashboard.html',
  '/login.html',
  '/register.html',
  '/students_table.html',
  // Hakikisha faili hizi zipo kwenye folda yako ya mradi.
  // Ikiwa monthly_report.html na export_report.html hazipo, ziondoe au ziunde.
  '/monthly_report.html', 
  '/export_report.html', 
  '/majina.json', // Ikiwa hii ni faili halisi
  '/manifest.json', // Manifest yako ya PWA
  '/rsz_capture.png', // Aikoni zako zote
  '/app.js' // JavaScript yako nyingine ya programu
];

// Install event - cache everything
// Tukio la 'install' - huhifadhi kila kitu kwenye cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Inahifadhi rasilimali kwenye cache.');
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error('Service Worker: Kosa wakati wa kuhifadhi rasilimali:', error);
      // Unaweza kuongeza mantiki ya kushughulikia makosa hapa,
      // lakini kwa kawaida, ukosefu wa baadhi ya faili kwenye urlsToCache
      // utazuia usajili wa service worker.
    })
  );
});

// Activate event - clean up old caches (optional but good practice)
// Tukio la 'activate' - husafisha cache za zamani (si lazima lakini ni tabia nzuri)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Inafuta cache ya zamani:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// Fetch event - serve from cache first, then network, then fallback
// Tukio la 'fetch' - hutoa kutoka cache kwanza, kisha mtandao, kisha fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Ikiwa rasilimali ipo kwenye cache, irudishe
      if (response) {
        return response;
      }
      // Vinginevyo, jaribu kuipata kutoka mtandaoni
      return fetch(event.request).then(fetchRes => {
        // Ikiwa ombi la mtandaoni limefanikiwa, lihifadhi kwenye cache na urudishe jibu
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchRes.clone()); // Hifadhi nakala kwenye cache
          return fetchRes;
        });
      }).catch(() => {
        // Ikiwa mtandaoni hakuna, au kuna kosa, rudisha ukurasa wa nje ya mtandao (fallback)
        console.log('Service Worker: Mtandao haupatikani, inarudisha fallback.');
        return caches.match('/index.html'); // Rudisha ukurasa mkuu kama fallback
      });
    })
  );
});
