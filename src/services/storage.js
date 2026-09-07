// Reliable Storage Service for Chaibasa Engineering College (CEC) PYQ Portal
// Uses IndexedDB for full-size PDF / Image files (up to hundreds of MBs)
// with LocalStorage fallback for metadata & auth.

const STORAGE_KEYS = {
  PAPERS_META: 'cec_pyq_papers_meta_v3',
  USER: 'cec_pyq_user_v2',
};

const DB_NAME = 'CEC_PYQ_HUB_DB';
const DB_VERSION = 1;
const STORE_NAME = 'papers';

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => {
      console.warn('IndexedDB open error:', e);
      resolve(null);
    };
  });
}

// Save all papers to IndexedDB
export async function savePapersToIndexedDB(papers) {
  try {
    const db = await openDB();
    if (!db) return false;

    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Clear existing & rewrite
    await new Promise((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => resolve();
      clearReq.onerror = () => reject(clearReq.error);
    });

    for (const paper of papers) {
      store.put(paper);
    }

    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.error('Error saving to IndexedDB:', err);
    return false;
  }
}

// Load all papers from IndexedDB
export async function loadPapersFromIndexedDB() {
  try {
    const db = await openDB();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.error('Error loading from IndexedDB:', err);
    return [];
  }
}

// Synchronous initial load (from localStorage cache if available)
export const getStoredPapers = () => {
  try {
    const meta = localStorage.getItem(STORAGE_KEYS.PAPERS_META);
    if (meta) {
      return JSON.parse(meta);
    }
    // Check older key fallback
    const old = localStorage.getItem('cec_pyq_clean_papers_v2');
    return old ? JSON.parse(old) : [];
  } catch (e) {
    return [];
  }
};

// Save papers: updates IndexedDB (stores real PDF/Image data) + localStorage (metadata cache)
export const savePapers = (papers) => {
  // 1. Save full objects (including heavy fileDataUrl) into IndexedDB
  savePapersToIndexedDB(papers);

  // 2. Save metadata into localStorage for instant load
  try {
    const metaOnly = papers.map((p) => {
      // If fileDataUrl is small (<200KB) keep it, otherwise keep metadata only in localStorage
      const isSmall = p.fileDataUrl && p.fileDataUrl.length < 200000;
      return {
        ...p,
        fileDataUrl: isSmall ? p.fileDataUrl : null,
      };
    });
    localStorage.setItem(STORAGE_KEYS.PAPERS_META, JSON.stringify(metaOnly));
  } catch (e) {
    // If quota exceeded, save minimal meta
    try {
      const minMeta = papers.map(({ fileDataUrl, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEYS.PAPERS_META, JSON.stringify(minMeta));
    } catch (err) {
      console.warn('LocalStorage full, rely on IndexedDB');
    }
  }
};

// Current user authentication state
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
};
