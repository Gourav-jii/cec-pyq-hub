// Frontend API client for CEC PYQ Hub (Backend + Cloudinary + MongoDB)
// Seamlessly connects with backend Express API, with graceful offline fallback.

import {
  savePapers,
  getStoredPapers,
  loadPapersFromIndexedDB,
} from './storage';

const API_BASE = '/api/papers';

// Fetch all papers from MongoDB (with fallback to IndexedDB)
export async function fetchAllPapers() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.papers)) {
      // Sync to local cache
      savePapers(data.papers);
      return data.papers;
    }
    throw new Error('Invalid response structure');
  } catch (err) {
    console.warn('Backend not reachable or MongoDB not configured yet, using local IndexedDB:', err.message);
    const local = await loadPapersFromIndexedDB();
    return local && local.length > 0 ? local : getStoredPapers();
  }
}

// Upload paper (sends file to Cloudinary & saves metadata in MongoDB)
export async function uploadPaperToServer(paperData, file) {
  try {
    const formData = new FormData();
    formData.append('subjectName', paperData.subjectName);
    formData.append('subjectCode', paperData.subjectCode || '');
    formData.append('branch', paperData.branch);
    formData.append('branchName', paperData.branchName);
    formData.append('semester', paperData.semester);
    formData.append('examType', paperData.examType || 'end-sem');
    formData.append('year', paperData.year);
    formData.append('uploaderName', paperData.uploaderName);
    formData.append('uploaderEmail', paperData.uploaderEmail);

    if (file) {
      formData.append('file', file);
    } else if (paperData.fileDataUrl) {
      formData.append('fileDataUrl', paperData.fileDataUrl);
      formData.append('fileName', paperData.fileName);
      formData.append('fileType', paperData.fileType);
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.paper) {
      return { success: true, paper: data.paper, cloud: true };
    }
    throw new Error('Failed to get uploaded paper data');
  } catch (err) {
    console.warn('Direct backend upload failed, falling back to IndexedDB:', err.message);
    return {
      success: true,
      paper: paperData,
      cloud: false,
      fallbackMessage: err.message,
    };
  }
}

// Delete paper from MongoDB & Cloudinary
export async function deletePaperFromServer(paperId) {
  try {
    const res = await fetch(`${API_BASE}/${paperId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn('Backend delete failed, removing locally:', err.message);
  }
  return true;
}
