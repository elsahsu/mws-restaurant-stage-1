const CACHE_NAME = 'rw-cache-v1';

self.addEventListener('install', function(event) {
  // TODO: cache /skeleton rather than the root page
  console.log("Saving static files to cache");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Caching...");
      return cache.addAll([
        '/index.html',
        '/css/styles.css',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/js/sw.js'
      ])
      .catch(function(error) {
        console.log('Failed to add files to cache');
        console.log(error);
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Fetching');
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith.caches.match('index.html');
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log('Fetching from cache');
      return response || fetch(event.request);
    })
  );
});
