// const CACHE_VERSION = 'v2';

// // Service worker installed
// self.addEventListener('install', async (e) => {
//   console.log('Service Worker installed');
// });

// // Service worker activated
// self.addEventListener('activate', async (e) => {
//   console.log('Service Worker activated');

//   // Cleanup old caches
//   try {
//     const cacheNames = await caches.keys();
//     for (let name of cacheNames) {
//       if (CACHE_VERSION !== name) {
//         caches.delete(name);
//       }
//     }
//   } catch (err) {
//     console.log(`Error: ${err}`);
//   }

//   // Fetch immediately
//   e.waitUntil(clients.claim());
// });

// // Listen for requests
// self.addEventListener('fetch', (e) => {
//   console.log('Service Worker fetch');

//   e.respondWith(handleRequest(e));
// });

// async function handleRequest(e) {
//   try {
//     // Respond
//     let response = await caches.match(e.request);
//     if (response) {
//       return response;
//     } else {
//       // Cache and respond
//       response = await fetch(e.request);
//       const cache = await caches.open(CACHE_VERSION);
//       cache.put(e.request, response.clone());

//       return response;
//     }
//   } catch (err) {
//     return await caches.match(e.request);
//   }
// }
