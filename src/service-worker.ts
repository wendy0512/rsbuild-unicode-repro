/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkOnly, StaleWhileRevalidate } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
// precacheAndRoute(self.__WB_MANIFEST);
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ignored = self.__WB_MANIFEST;

// 移除过时的缓存
cleanupOutdatedCaches();

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== "navigate") {
      return false;
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith("/_")) {
      return false;
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }

    // Return true to signal that we want to use the handler.
    return true;
  },
  // createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
  new NetworkOnly()
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => {
    if (url.origin === self.location.origin) {
      const fileExtension = url.pathname.split(".").pop()?.toLowerCase();
      if (fileExtension) {
        return ["jpg", "jpeg", "png", "gif", "ico", "svg"].includes(
          fileExtension
        );
      }
    }
    return false;
  },
  // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: "images",
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 1500 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener("message", (event) => {
  if (event.data) {
    if (event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    } else if (event.data.type === "SKIP_WAITING_WHEN_SOLO") {
      self.clients
        .matchAll({
          includeUncontrolled: true,
        })
        .then((clients) => {
          if (clients.length < 2) {
            self.skipWaiting();
          }
        });
    }
  }
});

self.addEventListener("notificationclick", (e) => {
  const notification = e.notification;

  notification.close();
  e.waitUntil(
    !notification.data.external
      ? self.clients.matchAll({ type: "window" }).then((clientsArr) => {
          if (clientsArr[0]) {
            clientsArr[0].focus();
            if (!notification.data.external) {
              clientsArr[0].postMessage({
                type: "NOTIFICATION_CLICK",
                url: notification.data.url,
              });
            }
          } else {
            self.clients.openWindow(notification.data.url);
          }
        })
      : self.clients.openWindow(notification.data.url)
  );
});

// Any other custom service worker logic can go here.