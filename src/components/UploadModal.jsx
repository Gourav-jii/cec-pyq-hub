import React, { useState } from 'react';
import { X, Upload, FileCheck, AlertCircle, LogIn, ExternalLink } from 'lucide-react';
import { BRANCHES, YEARS } from '../data/initialData';

export default function UploadModal({
  currentUser,
  onClose,
  onOpenAuth,
  onUploadSuccess,
}) {
  const [branch, setBranch] = useState('cse');
  const [semester, setSemester] = useState(5);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [examType, setExamType] = useState('external');
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isTooLarge, setIsTooLarge] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB Cloudinary Free Tier Limit

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit! Please PDF ko compress karke upload karein.`
      );
      setIsTooLarge(true);
      setSelectedFile(null);
      setFileDataUrl(null);
      return;
    }
    setSelectedFile(file);
    setIsTooLarge(false);
    setErrorMsg('');

    // Only read Data URL for small files (<2MB) to save mobile browser memory
    if (file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileDataUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setErrorMsg('Please enter Subject Name');
      return;
    }
    if (!selectedFile && !fileDataUrl) {
      setErrorMsg('Please select a PDF or Image file to upload');
      return;
    }

    const branchObj = BRANCHES.find((b) => b.id === branch);

    const newPaper = {
      id: `cec-pyq-${Date.now()}`,
      subjectName: subjectName.trim(),
      subjectCode: subjectCode.trim() || '',
      branch: branch,
      branchName: branchObj ? branchObj.name : branch.toUpperCase(),
      semester: Number(semester),
      examType: examType,
      year: String(year),
      uploaderName: currentUser?.name || 'CEC Student',
      uploaderEmail: currentUser?.email || '',
      uploadedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      fileType: selectedFile?.type || 'application/pdf',
      fileDataUrl: fileDataUrl || null,
      fileName: selectedFile?.name || `${subjectName.replace(/\s+/g, '_')}_${year}.pdf`,
    };

    onUploadSuccess(newPaper, selectedFile);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Upload Question Paper (PYQ)</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {!currentUser ? (
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <LogIn size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>
                Gmail Login Required
              </h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
                PYQ paper upload karne ke liye pehle apna Gmail account se login karein.
              </p>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '10px' }}
                onClick={onOpenAuth}
              >
                Sign In With Gmail
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {errorMsg && (
                <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 8, marginBottom: 14, fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2, color: '#dc2626' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{errorMsg}</div>
                      {isTooLarge && (
                        <div style={{ marginTop: 8 }}>
                          <a
                            href="https://www.ilovepdf.com/compress_pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              background: '#dc2626',
                              color: '#ffffff',
                              padding: '6px 12px',
                              borderRadius: 6,
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              boxShadow: '0 1px 3px rgba(220,38,38,0.3)',
                            }}
                          >
                            <span>iLovePDF par Free Compress karein</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
                Uploading as: <strong style={{ color: '#0f172a' }}>{currentUser.name}</strong> ({currentUser.email})
              </div>

              {/* Branch & Semester */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Branch *</label>
                  <select 
                    className="form-select"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  >
                    {BRANCHES.filter((b) => b.id !== 'all').map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Semester *</label>
                  <select 
                    className="form-select"
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Name & Subject Code */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Subject Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. DBMS, DAA, Thermodynamics"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject Code (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. CS501"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                  />
                </div>
              </div>

              {/* Exam Type & Year */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Exam Type *</label>
                  <select 
                    className="form-select"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                  >
                    <option value="internal-1">Internal 1</option>
                    <option value="internal-2">Internal 2</option>
                    <option value="external">External</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Exam Year *</label>
                  <select 
                    className="form-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {YEARS.filter((y) => y !== 'All Years').map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label className="form-label">Select Paper File (PDF or Image) *</label>
                <div 
                  className="file-upload-box"
                  onClick={() => document.getElementById('simple-file-picker').click()}
                >
                  <Upload size={28} color="#1d4ed8" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e3a8a' }}>
                    Click to choose PDF or Image file
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Supports PDF, JPG, PNG (Max 10MB)
                  </div>
                  <input 
                    type="file" 
                    id="simple-file-picker" 
                    style={{ display: 'none' }} 
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </div>

                {/* Helper info & Compress shortcut */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6, marginTop: 6, fontSize: '0.78rem', color: '#64748b' }}>
                  <span>Limit: <strong>10MB</strong> per paper</span>
                  <a
                    href="https://www.ilovepdf.com/compress_pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      color: '#2563eb',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>PDF compress karna hai? (iLovePDF)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {selectedFile && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f1f5f9', borderRadius: 8, marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', fontWeight: 600 }}>
                      <FileCheck size={18} color="#10b981" />
                      <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => { setSelectedFile(null); setFileDataUrl(null); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={15} color="#64748b" />
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Upload Paper
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
