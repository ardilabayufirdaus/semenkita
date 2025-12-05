/**
 * Utility functions for clearing browser data
 */

export const clearAllBrowserData = async () => {
  try {
    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear all cookies
    clearAllCookies();

    // Clear IndexedDB
    await clearIndexedDB();

    // Clear Cache API (Service Workers)
    await clearCacheAPI();

    console.log('All browser data cleared successfully');
  } catch (error) {
    console.error('Error clearing browser data:', error);
  }
};

/**
 * Clear all cookies by setting expiration to past date
 */
export const clearAllCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    
    // Delete from root
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    // Delete from all possible paths
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
  });

  console.log('All cookies cleared');
};

/**
 * Clear IndexedDB databases
 */
export const clearIndexedDB = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if ('indexedDB' in window) {
        const databases = window.indexedDB.databases ? window.indexedDB.databases() : Promise.resolve([]);
        
        Promise.resolve(databases).then((dbs: any[]) => {
          dbs.forEach((db) => {
            try {
              window.indexedDB.deleteDatabase(db.name);
            } catch (error) {
              console.warn(`Could not delete IndexedDB: ${db.name}`, error);
            }
          });
          resolve();
        });
      } else {
        resolve();
      }
    } catch (error) {
      console.warn('Error clearing IndexedDB:', error);
      resolve(); // Don't reject, just continue
    }
  });
};

/**
 * Clear Cache API (Service Worker caches)
 */
export const clearCacheAPI = async (): Promise<void> => {
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      console.log('Cache API cleared');
    }
  } catch (error) {
    console.warn('Error clearing Cache API:', error);
  }
};

/**
 * Clear specific cookie by name
 */
export const clearCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
};

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  document.cookie.split(';').forEach((cookie) => {
    const [key, value] = cookie.split('=').map((c) => c.trim());
    if (key) {
      cookies[key] = decodeURIComponent(value || '');
    }
  });
  return cookies;
};
