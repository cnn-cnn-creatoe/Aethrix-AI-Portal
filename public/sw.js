/**
 * Service Worker for Creative Studio App
 * Provides offline functionality and performance optimization
 */

const CACHE_NAME = 'creative-studio-v1.0.9';
const STATIC_CACHE_NAME = 'creative-studio-static-v1.0.9';
const DYNAMIC_CACHE_NAME = 'creative-studio-dynamic-v1.0.9';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/main.js',
  '/tools.html',
  '/manifest.json',
  '/js/aethrix-assistant.js'
];

// Dynamic assets patterns
const DYNAMIC_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:woff|woff2|ttf|eot)$/
];

// ===================================
// Install Event
// ===================================

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');

  event.waitUntil((async () => {
    try {
      const cache = await caches.open(STATIC_CACHE_NAME);
      console.log('Caching static assets');
      const results = await Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset))
      );
      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length) {
        console.warn('Some static assets were skipped during install:', failed.map((f) => f.reason?.message || f.reason));
      }
    } catch (error) {
      console.error('Service Worker installation encountered an error:', error);
    } finally {
      await self.skipWaiting();
    }
  })());
});

// ===================================
// Activate Event
// ===================================

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated successfully');
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('❌ Service Worker activation failed:', error);
      })
  );
});

// ===================================
// Fetch Event
// ===================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isDynamicAsset(request)) {
    event.respondWith(handleDynamicAsset(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleOtherRequests(request));
  }
});

// ===================================
// Request Handlers
// ===================================

function handleStaticAsset(request) {
  return caches.match(request)
    .then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
    })
    .catch(() => {
      // Return offline fallback if available
      if (request.destination === 'document') {
        return caches.match('/offline.html');
      }
    });
}

function handleDynamicAsset(request) {
  return caches.open(DYNAMIC_CACHE_NAME)
    .then((cache) => {
      return cache.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version and update in background
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  cache.put(request, networkResponse.clone());
                }
              })
              .catch(() => {
                // Network failed, but we have cached version
              });

            return cachedResponse;
          }

          // Not in cache, fetch from network
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            });
        });
    })
    .catch(() => {
      // Return fallback for images
      if (request.destination === 'image') {
        return new Response(
          '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#999">图片加载失败</text></svg>',
          { headers: { 'Content-Type': 'image/svg+xml' } }
        );
      }
    });
}

function handleNavigationRequest(request) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE_NAME)
          .then((cache) => cache.put(request, responseClone));
      }
      return networkResponse;
    })
    .catch(() => {
      // Return cached version or offline page
      return caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || caches.match('/index.html');
        });
    });
}

function handleOtherRequests(request) {
  return fetch(request)
    .catch(() => {
      return caches.match(request);
    });
}

// ===================================
// Helper Functions
// ===================================

function isStaticAsset(request) {
  const url = new URL(request.url);
  return STATIC_ASSETS.some(asset => url.pathname === asset) ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js');
}

function isDynamicAsset(request) {
  const url = request.url;
  return DYNAMIC_PATTERNS.some(pattern => pattern.test(url));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

// ===================================
// Background Sync (if supported)
// ===================================

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  // For example, sync form data, analytics, etc.
  return Promise.resolve();
}

// ===================================
// Push Notifications (if needed)
// ===================================

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.primaryKey
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icon-explore.png'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/icon-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ===================================
// Cache Management
// ===================================

function cleanupCaches() {
  return caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('creative-studio-') &&
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    });
}

// Cleanup old caches periodically
setInterval(cleanupCaches, 24 * 60 * 60 * 1000); // Once per day

// ===================================
// Error Handling
// ===================================

self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});

console.log('🎯 Service Worker script loaded');
