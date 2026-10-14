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

// Upload paper (Direct to Cloudinary to bypass Vercel 4.5MB limit, then save metadata in MongoDB)
export async function uploadPaperToServer(paperData, file) {
  try {
    let fileUrl = '';
    let cloudinaryPublicId = '';
    let fileName = file?.name || paperData.fileName || `${paperData.subjectName}_${paperData.year}.pdf`;
    let fileType = file?.type || paperData.fileType || 'application/pdf';
    let fileSize = file?.size || 0;

    // Step 1: Direct Cloudinary Signed Upload (bypasses Vercel 4.5MB limit entirely)
    try {
      const signRes = await fetch(`${API_BASE}/cloudinary-sign`);
      if (signRes.ok) {
        const signData = await signRes.json();
        if (signData.success && signData.signature) {
          const cldFormData = new FormData();
          cldFormData.append('file', file || paperData.fileDataUrl);
          cldFormData.append('api_key', signData.apiKey);
          cldFormData.append('timestamp', signData.timestamp);
          cldFormData.append('signature', signData.signature);
          cldFormData.append('folder', signData.folder);

          const cldUploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
            {
              method: 'POST',
              body: cldFormData,
            }
          );

          if (cldUploadRes.ok) {
            const cldJson = await cldUploadRes.json();
            fileUrl = cldJson.secure_url;
            cloudinaryPublicId = cldJson.public_id;
            fileType = cldJson.format ? `application/${cldJson.format}` : fileType;
          } else {
            const cldErr = await cldUploadRes.json().catch(() => ({}));
            const errMsg = cldErr.error?.message || `Cloudinary upload failed (${cldUploadRes.status})`;
            throw new Error(errMsg);
          }
        } else {
          throw new Error('Could not get upload signature from server');
        }
      }
    } catch (directErr) {
      console.warn('Direct Cloudinary signed upload error:', directErr.message);
      // If error is about file size or API key, don't fallback to Vercel (will 413)
      if (
        directErr.message.includes('File size') ||
        directErr.message.includes('API Key') ||
        directErr.message.includes('exceeds')
      ) {
        throw directErr;
      }
    }

    // Step 2: If Direct Upload Succeeded, save metadata JSON to MongoDB Atlas
    if (fileUrl) {
      const metaRes = await fetch(`${API_BASE}/save-metadata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paperData,
          fileUrl,
          cloudinaryPublicId,
          fileName,
          fileType,
          fileSize,
        }),
      });

      if (metaRes.ok) {
        const metaData = await metaRes.json();
        if (metaData.success && metaData.paper) {
          return { success: true, paper: metaData.paper, cloud: true };
        }
      }
    }

    // Step 3: Fallback standard backend upload
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
      formData.append('fileName', fileName);
      formData.append('fileType', fileType);
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
