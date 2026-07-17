export const LOCATION_CHANGE_EVENT = 'vite:navigationchange';

let isInstalled = false;

export function getLocationSnapshot(): string {
  return window.location.pathname + window.location.search + window.location.hash;
}

export function notifyLocationChange(): void {
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
}

export function subscribeToLocationChange(callback: () => void): () => void {
  window.addEventListener(LOCATION_CHANGE_EVENT, callback);
  window.addEventListener('popstate', callback);

  return () => {
    window.removeEventListener(LOCATION_CHANGE_EVENT, callback);
    window.removeEventListener('popstate', callback);
  };
}

export function installNavigationEvents(): void {
  if (isInstalled) {
    return;
  }

  isInstalled = true;

  const pushState = window.history.pushState.bind(window.history);
  const replaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = (...args) => {
    pushState(...args);
    notifyLocationChange();
  };

  window.history.replaceState = (...args) => {
    replaceState(...args);
    notifyLocationChange();
  };
}
