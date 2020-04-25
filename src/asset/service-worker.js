const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
  // Assets
  '/main.js',
  '/styles.css',

  // Icons
  '/icons/close.svg',
  '/icons/heart.svg',
  '/icons/home.svg',
  '/icons/settings.svg',
  '/icons/css3.svg',
  '/icons/html5.svg',
  '/icons/javascript.svg',
  '/icons/react.svg',
  '/icons/redux.svg',

  // Images
  '/img/p1.png',
  '/img/p2.png',
  '/img/p3.png',
  '/img/p4.png',
  '/img/p5.png',
  '/img/p6.png',

  // Pages
  '/',
  '/index.html',
  '/offline.html',
  '/favourite/',
  '/settings/'
];

self.addEventListener('install', (event) => {
  console.log('👷', 'install', event);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('👷', 'activate', event);

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        return fetch(event.request)
      }).catch(error => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match('offline.html');
          });
      })
  );
});