// Persistent Offline Map Pack Sync Engine (100% Airplane Mode Support)
// Stores all 492 .topo.json map files in persistent browser CacheStorage ('phoenix-atlas-offline-maps-v2')
// so PhoenixAtlas never needs Wi-Fi or mobile data after initial sync.

import { useState, useEffect } from 'react';

export const OFFLINE_MAPS_CACHE_NAME = 'phoenix-atlas-offline-maps-v10';

let hasPurgedLegacyCaches = false;

async function purgeLegacyOfflineMapCaches(): Promise<void> {
  if (hasPurgedLegacyCaches || typeof window === 'undefined' || !('caches' in window)) return;
  hasPurgedLegacyCaches = true;
  try {
    const keys = await window.caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith('phoenix-atlas-offline-maps-') && k !== OFFLINE_MAPS_CACHE_NAME)
        .map((k) => window.caches.delete(k))
    );
  } catch {
    // Ignore cache cleanup error
  }
}

export interface OfflineSyncState {
  status: 'idle' | 'syncing' | 'ready' | 'offline';
  cachedCount: number;
  totalCount: number;
  isOnline: boolean;
}

let currentSyncState: OfflineSyncState = {
  status: 'idle',
  cachedCount: 0,
  totalCount: 503,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
};

const listeners = new Set<(state: OfflineSyncState) => void>();

function notifyListeners(patch: Partial<OfflineSyncState>) {
  currentSyncState = { ...currentSyncState, ...patch };
  listeners.forEach((fn) => fn(currentSyncState));
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    notifyListeners({ isOnline: true });
    startBackgroundOfflineSync(false);
  });
  window.addEventListener('offline', () => {
    notifyListeners({
      isOnline: false,
      status: currentSyncState.cachedCount >= currentSyncState.totalCount ? 'ready' : 'offline'
    });
  });
}

let isSyncRunning = false;

/**
 * Fetch JSON from persistent CacheStorage first (works 100% in Airplane Mode),
 * falling back to network fetch and caching the result permanently on device.
 */
export async function fetchWithOfflineCache(url: string): Promise<Response> {
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      await purgeLegacyOfflineMapCaches();
      const cache = await window.caches.open(OFFLINE_MAPS_CACHE_NAME);
      const cachedRes = await cache.match(url);
      if (cachedRes && cachedRes.ok) {
        return cachedRes;
      }
      const netRes = await fetch(url);
      if (netRes.ok) {
        const ct = netRes.headers.get('content-type') || '';
        if (!ct.includes('text/html')) {
          cache.put(url, netRes.clone()).catch(() => {});
        }
      }
      return netRes;
    } catch {
      return fetch(url);
    }
  }
  return fetch(url);
}

/**
 * Background pre-cacher that downloads all .topo.json files listed in /maps/offline_manifest.json
 * in gentle idle background pacing (or fast batches when manually triggered in Settings)
 * so every country, subdivision, area code & postcode quiz works in Airplane Mode.
 */
export async function startBackgroundOfflineSync(forceImmediate = false): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  if (isSyncRunning && !forceImmediate) return;
  if (currentSyncState.status === 'ready' && !forceImmediate) return;

  isSyncRunning = true;
  try {
    await purgeLegacyOfflineMapCaches();
    // When running automatically in background on app start, wait 3.5s so initial 3D Globe boot is 100% instant
    if (!forceImmediate) {
      await new Promise((r) => setTimeout(r, 3500));
    }

    const cache = await window.caches.open(OFFLINE_MAPS_CACHE_NAME);
    let manifestUrls: string[] = [];

    try {
      const manRes = forceImmediate
        ? await fetch('/maps/offline_manifest.json', { cache: 'no-cache' })
        : await fetchWithOfflineCache('/maps/offline_manifest.json');
      if (manRes.ok) {
        if (forceImmediate) {
          cache.put('/maps/offline_manifest.json', manRes.clone()).catch(() => {});
        }
        const manJson = await manRes.json();
        if (Array.isArray(manJson?.urls)) {
          manifestUrls = manJson.urls;
        }
      }
    } catch {
      // Offline before manifest fetched
    }

    if (manifestUrls.length === 0) {
      isSyncRunning = false;
      return;
    }

    const existingKeys = await cache.keys();
    const cachedPaths = new Set<string>(
      existingKeys.map((req) => {
        try {
          return new URL(req.url).pathname;
        } catch {
          return req.url;
        }
      })
    );

    const missingUrls = manifestUrls.filter((u) => !cachedPaths.has(u));
    const initialCachedCount = manifestUrls.length - missingUrls.length;

    if (missingUrls.length === 0) {
      notifyListeners({
        status: 'ready',
        cachedCount: manifestUrls.length,
        totalCount: manifestUrls.length
      });
      isSyncRunning = false;
      return;
    }

    if (!navigator.onLine) {
      notifyListeners({
        status: 'offline',
        cachedCount: initialCachedCount,
        totalCount: manifestUrls.length,
        isOnline: false
      });
      isSyncRunning = false;
      return;
    }

    notifyListeners({
      status: 'syncing',
      cachedCount: initialCachedCount,
      totalCount: manifestUrls.length,
      isOnline: true
    });

    let done = initialCachedCount;
    const batchSize = forceImmediate ? 6 : 2;
    const delayMs = forceImmediate ? 20 : 110;

    for (let i = 0; i < missingUrls.length; i += batchSize) {
      if (!navigator.onLine) {
        notifyListeners({ status: 'offline', isOnline: false });
        isSyncRunning = false;
        return;
      }
      const batch = missingUrls.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (url) => {
          try {
            const res = await fetch(url, forceImmediate ? { cache: 'no-cache' } : undefined);
            if (res.ok) {
              const ct = res.headers.get('content-type') || '';
              if (!ct.includes('text/html')) {
                await cache.put(url, res);
                done++;
              }
            }
          } catch {
            // Ignore transient error
          }
        })
      );
      notifyListeners({
        status: done >= manifestUrls.length ? 'ready' : 'syncing',
        cachedCount: done,
        totalCount: manifestUrls.length
      });
      await new Promise((r) => setTimeout(r, delayMs));
    }

    notifyListeners({
      status: done >= manifestUrls.length ? 'ready' : 'idle',
      cachedCount: done,
      totalCount: manifestUrls.length
    });
  } finally {
    isSyncRunning = false;
  }
}

/**
 * Force check and apply any new Service Worker / App Update in 1 tap without losing IndexedDB progress!
 */
export async function checkAndApplyAppUpdate(): Promise<string> {
  if (typeof window === 'undefined') return 'Up to date';
  try {
    if ('caches' in window) {
      const keys = await window.caches.keys();
      await Promise.all(keys.map((k) => window.caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.update();
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    }
    // Reload page cleanly after brief delay to load latest published bundle & re-sync offline files while keeping IndexedDB untouched
    setTimeout(() => {
      window.location.reload();
    }, 450);
    return 'Updating PhoenixAtlas & offline package to latest published version...';
  } catch {
    window.location.reload();
    return 'Reloading latest version...';
  }
}

export function useOfflineSyncStatus(): OfflineSyncState {
  const [state, setState] = useState<OfflineSyncState>(currentSyncState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}
