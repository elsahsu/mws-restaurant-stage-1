const CACHE_NAME = 'rw-cache-v1';


self.addEventListener('install', event => {
  // TODO: cache /skeleton rather than the root page
  console.log("Saving static files to cache");
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("Caching...");
      return cache.addAll([
        '/',
        '/restaurant.html',
        '/css/styles.css',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/sw.js',
        '/data/restaurants.json'
      ])
      .catch(function(error) {
        console.log('Failed to add files to cache');
        console.log(error);
      });
    })
  );
});


self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request);
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        console.log('Fetching from cache:', event.request);
        if (response) {
          console.log('Serving request from cache');
          return response;
        }
        return fetch(event.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            console.log('Request not found in cache, caching now');
            cache.put(event.request.url, response.clone());
            return response;
          });
        })
      })
    );
  }
});
