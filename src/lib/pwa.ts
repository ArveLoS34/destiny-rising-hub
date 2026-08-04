/**
 * PWA Registration Service
 * Handles service worker registration for offline support
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined") return null;

  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            // New content available, show update notification
            console.log("New content is available; please refresh.");
          } else {
            // Content cached for offline use
            console.log("Content is cached for offline use.");
          }
        }
      };
    };

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}

export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (!("serviceWorker" in navigator)) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.unregister();
  } catch (error) {
    console.error("Service Worker unregistration failed:", error);
    return false;
  }
}
