import React, { useState } from 'react';
import { X, Download, Printer, FileText, ZoomIn, ZoomOut, RotateCcw, AlertCircle } from 'lucide-react';

export default function PaperViewerModal({ paper, onClose, onDownload }) {
  if (!paper) return null;

  const [zoom, setZoom] = useState(100);
  const [useIframe, setUseIframe] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);

  const fileSource = paper.fileUrl || paper.fileDataUrl || '';
  const isCloudinary = fileSource.includes('cloudinary.com');
  const isPdf =
    paper.fileType === 'application/pdf' ||
    (paper.fileName && paper.fileName.toLowerCase().endsWith('.pdf')) ||
    fileSource.toLowerCase().includes('.pdf');

  // Cloudinary can render any PDF page seamlessly as crisp PNG
  const cloudinaryPngUrl = isCloudinary && isPdf
    ? fileSource.replace(/\.pdf(\?.*)?$/i, '.png')
    : null;

  // Determine primary preview URL
  const previewImageUrl = cloudinaryPngUrl || (paper.fileType?.includes('image') || fileSource.match(/\.(jpg|jpeg|png|webp)/i) ? fileSource : null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 60));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 960,
          width: '95%',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              {paper.subjectName}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>
              {paper.branchName || paper.branch?.toUpperCase()} • Semester {paper.semester} • {paper.year} ({paper.examType === 'mid-sem' ? 'Mid-Sem' : 'End-Sem'})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Zoom controls for image view */}
            {previewImageUrl && !useIframe && (
              <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: 8, padding: '2px 4px', gap: 2 }}>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  style={{ border: 'none', background: 'transparent', padding: 6, cursor: 'pointer', borderRadius: 4, display: 'flex' }}
                >
                  <ZoomOut size={15} color="#475569" />
                </button>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', minWidth: 36, textAlign: 'center' }}>
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  style={{ border: 'none', background: 'transparent', padding: 6, cursor: 'pointer', borderRadius: 4, display: 'flex' }}
                >
                  <ZoomIn size={15} color="#475569" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  title="Reset Zoom"
                  style={{ border: 'none', background: 'transparent', padding: 6, cursor: 'pointer', borderRadius: 4, display: 'flex' }}
                >
                  <RotateCcw size={13} color="#64748b" />
                </button>
              </div>
            )}

            <button
              className="btn btn-secondary btn-print-hide"
              style={{ padding: '7px 12px', fontSize: '0.85rem' }}
              onClick={() => window.print()}
              title="Print Paper"
            >
              <Printer size={15} />
              <span className="btn-label-hide-mobile">Print</span>
            </button>

            <button
              className="btn btn-primary"
              style={{ padding: '7px 14px', fontSize: '0.85rem' }}
              onClick={() => onDownload(paper)}
            >
              <Download size={15} />
              <span className="btn-label-hide-mobile">Download</span>
            </button>

            <button className="close-btn" onClick={onClose} title="Close" style={{ marginLeft: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          className="modal-body"
          style={{
            flex: 1,
            padding: 20,
            overflowY: 'auto',
            background: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {previewImageUrl && !useIframe && !imgLoadError ? (
            <div style={{ width: '100%', textAlign: 'center', transition: 'transform 0.15s ease' }}>
              <img
                src={previewImageUrl}
                alt={paper.subjectName}
                onError={() => {
                  console.warn('Image preview failed, falling back to iframe');
                  setImgLoadError(true);
                  setUseIframe(true);
                }}
                style={{
                  maxWidth: `${zoom}%`,
                  width: zoom === 100 ? '100%' : 'auto',
                  borderRadius: 8,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  background: 'white',
                  display: 'inline-block',
                }}
              />
              {cloudinaryPngUrl && (
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <button
                    onClick={() => setUseIframe(true)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#cbd5e1',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    Open with Browser PDF Viewer
                  </button>
                  <a
                    href={fileSource}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#cbd5e1',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '5px 12px',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      textDecoration: 'none',
                    }}
                  >
                    Open Original in New Tab ↗
                  </a>
                </div>
              )}
            </div>
          ) : fileSource ? (
            <div style={{ width: '100%', height: '100%', minHeight: 600, display: 'flex', flexDirection: 'column' }}>
              {isCloudinary && isPdf && (
                <div
                  style={{
                    background: '#1e293b',
                    color: '#94a3b8',
                    padding: '8px 14px',
                    borderRadius: '8px 8px 0 0',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} color="#38bdf8" />
                    <span>Native PDF Viewer</span>
                  </div>
                  {cloudinaryPngUrl && (
                    <button
                      onClick={() => setUseIframe(false)}
                      style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      Switch back to Document View
                    </button>
                  )}
                </div>
              )}
              <iframe
                src={fileSource}
                title="Paper Preview"
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: 580,
                  border: 'none',
                  borderRadius: isCloudinary && isPdf ? '0 0 8px 8px' : 8,
                  background: 'white',
                }}
              />
            </div>
          ) : (
            <div
              style={{
                background: 'white',
                padding: 40,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                maxWidth: 480,
                margin: 'auto',
              }}
            >
              <FileText size={48} color="#1d4ed8" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>
                {paper.subjectName}
              </h4>
              <p style={{ color: '#64748b', marginBottom: 20, fontSize: '0.9rem' }}>
                Jharkhand University of Technology (JUT) Examination Paper • Chaibasa Engineering College
              </p>
              <button className="btn btn-primary" onClick={() => onDownload(paper)}>
                <Download size={16} />
                <span>Download Question Paper Document</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
