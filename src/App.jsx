import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import PaperCard from './components/PaperCard';
import PaperViewerModal from './components/PaperViewerModal';
import UploadModal from './components/UploadModal';
import GoogleAuthModal from './components/GoogleAuthModal';
import Footer from './components/Footer';

import {
  getStoredPapers,
  savePapers,
  getCurrentUser,
  setCurrentUser,
} from './services/storage';
import {
  fetchAllPapers,
  uploadPaperToServer,
  deletePaperFromServer,
} from './services/api';
import LandingPage from './components/LandingPage';
import ToastNotification from './components/ToastNotification';
import { Upload, Layers, FileText } from 'lucide-react';

export default function App() {
  // User Auth
  const [currentUser, setUser] = useState(getCurrentUser);

  const handleLoginSuccess = (user) => {
    setUser(user);
    setCurrentUser(user);
    showToast(`Welcome, ${user.name}! Login successful.`, 'login');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentUser(null);
    showToast('Logged out successfully.', 'logout');
  };

  // Papers state (hydrates from MongoDB / IndexedDB)
  const [papers, setPapers] = useState(getStoredPapers);

  // Load papers on mount
  useEffect(() => {
    fetchAllPapers().then((loadedPapers) => {
      if (Array.isArray(loadedPapers)) {
        setPapers(loadedPapers);
      }
    });
  }, []);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my-uploads'

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [viewingPaper, setViewingPaper] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Handle Upload (Uploads to Cloudinary & saves to MongoDB)
  const handleUploadSuccess = async (newPaper, selectedFile) => {
    setIsUploadOpen(false);
    showToast(`Uploading "${newPaper.subjectName}"...`, 'info');

    const result = await uploadPaperToServer(newPaper, selectedFile);
    const paperToSave = result.paper || newPaper;

    const updated = [paperToSave, ...papers.filter((p) => p.id !== paperToSave.id)];
    setPapers(updated);
    savePapers(updated);

    showToast(`"${paperToSave.subjectName}" PYQ paper upload ho gaya!`, 'success');
  };

  // Handle Delete (Deletes from MongoDB & Cloudinary)
  const handleDeletePaper = async (paperId) => {
    if (window.confirm('Kya aap is question paper ko delete karna chahte hain?')) {
      await deletePaperFromServer(paperId);
      const updated = papers.filter((p) => p.id !== paperId);
      setPapers(updated);
      savePapers(updated);
      showToast('Question paper delete ho gaya.', 'delete');
    }
  };

  // Handle Download (Backend Proxy + Blob Download)
  const handleDownloadPaper = async (paper) => {
    showToast(`Downloading "${paper.subjectName}"...`, 'download');
    const fileName = paper.fileName || `${paper.subjectName.replace(/\s+/g, '_')}_${paper.year}.pdf`;

    // Strategy 1: Use backend download proxy (guaranteed download headers)
    const paperId = paper.id || paper._id;
    if (paperId) {
      try {
        const res = await fetch(`/api/papers/${paperId}/download`);
        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          showToast(`"${paper.subjectName}" downloaded successfully!`, 'success');
          return;
        }
      } catch (err) {
        console.warn('Backend download endpoint error, falling back:', err.message);
      }
    }

    // Strategy 2: Direct Blob fetch (for Base64 data URLs & direct file URLs)
    const fileTarget = paper.fileUrl || paper.fileDataUrl;
    if (fileTarget) {
      try {
        const res = await fetch(fileTarget);
        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          showToast(`"${paper.subjectName}" downloaded!`, 'success');
          return;
        }
      } catch (e) {
        console.warn('Direct blob fetch failed, falling back to window.open:', e.message);
      }

      // Strategy 3: Window open fallback
      window.open(fileTarget, '_blank');
      return;
    }

    // Strategy 4: Fallback text document
    const content = `CEC PYQ HUB - CHAIBASA ENGINEERING COLLEGE\nSubject: ${paper.subjectName}\nBranch: ${paper.branchName}\nSemester: ${paper.semester}\nYear: ${paper.year}\nUploaded by: ${paper.uploaderName}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paper.subjectName}_${paper.year}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // My Uploads Count
  const myUploadsCount = useMemo(() => {
    if (!currentUser) return 0;
    return papers.filter(
      (p) =>
        (p.uploaderEmail && p.uploaderEmail === currentUser.email) ||
        (p.uploaderName && p.uploaderName === currentUser.name)
    ).length;
  }, [papers, currentUser]);

  // Filter papers
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      // Tab filter
      if (activeTab === 'my-uploads') {
        const isMine =
          (p.uploaderEmail && p.uploaderEmail === currentUser?.email) ||
          (p.uploaderName && p.uploaderName === currentUser?.name);
        if (!isMine) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubj = p.subjectName?.toLowerCase().includes(q);
        const matchCode = p.subjectCode?.toLowerCase().includes(q);
        const matchBranch = p.branchName?.toLowerCase().includes(q);
        if (!matchSubj && !matchCode && !matchBranch) return false;
      }

      // Branch
      if (selectedBranch !== 'all' && p.branch !== selectedBranch) {
        return false;
      }

      // Semester
      if (selectedSemester !== 'all' && p.semester !== Number(selectedSemester)) {
        return false;
      }

      return true;
    });
  }, [papers, searchQuery, selectedBranch, selectedSemester, activeTab, currentUser]);

  return (
    <div>
      {/* Header */}
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      {!currentUser ? (
        <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
      ) : (
        /* USER IS LOGGED IN: SHOW CLEAN DASHBOARD (NO VIDEO) WITH FILTERS, TABS, PAPERS & UPLOAD */
        <main className="main-container">
          {/* Dashboard Header & Search */}
          <HeroSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentUser={currentUser}
          />

          {/* Filter Bar */}
          <FilterBar
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
          />

          {/* Papers Section with Tabs */}
          <section className="dashboard-papers-section">
            <div className="pyq-list-header">
              <div className="dashboard-tabs-group">
                <button
                  className={`dash-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <Layers size={16} />
                  <span>All Papers</span>
                  <span className="tab-counter">{papers.length}</span>
                </button>
                <button
                  className={`dash-tab-btn ${activeTab === 'my-uploads' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-uploads')}
                >
                  <FileText size={16} />
                  <span>My Uploads</span>
                  <span className="tab-counter">{myUploadsCount}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {(selectedBranch !== 'all' || selectedSemester !== 'all' || searchQuery || activeTab !== 'all') && (
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => {
                      setSelectedBranch('all');
                      setSelectedSemester('all');
                      setSearchQuery('');
                      setActiveTab('all');
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {filteredPapers.length > 0 ? (
              <div className="papers-grid">
                {filteredPapers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    currentUser={currentUser}
                    onView={(p) => setViewingPaper(p)}
                    onDownload={handleDownloadPaper}
                    onDelete={handleDeletePaper}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-box">
                <Upload className="empty-icon" />
                <h3 className="empty-title">
                  {activeTab === 'my-uploads'
                    ? 'Aapne abhi tak koi paper upload nahi kiya hai'
                    : 'Abhi tak koi paper upload nahi hua hai'}
                </h3>
                <p className="empty-desc">
                  {activeTab === 'my-uploads'
                    ? 'Apne purane semester exam papers upload karein taaki Chaibasa Engineering College ke baki students ko help mil sake!'
                    : selectedBranch !== 'all' || selectedSemester !== 'all' || searchQuery
                    ? 'Is filter ya search ke hisaab se koi paper nahi mila. Filter reset karein ya naya paper upload karein.'
                    : 'College ke exam me juniors aur batchmates ki help ke liye sabse pehle apna question paper upload karein!'}
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsUploadOpen(true)}
                >
                  <Upload size={16} />
                  <span>Upload PYQ Paper Now</span>
                </button>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {viewingPaper && (
        <PaperViewerModal
          paper={viewingPaper}
          onClose={() => setViewingPaper(null)}
          onDownload={handleDownloadPaper}
        />
      )}

      {isUploadOpen && currentUser && (
        <UploadModal
          currentUser={currentUser}
          onClose={() => setIsUploadOpen(false)}
          onOpenAuth={() => {
            setIsUploadOpen(false);
            setIsAuthOpen(true);
          }}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {isAuthOpen && (
        <GoogleAuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
