import React, { useState } from 'react';
import { X, Download, Printer, FileText, ZoomIn, ZoomOut, RotateCcw, AlertCircle, ExternalLink } from 'lucide-react';

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
    <div className="modal-overlay viewer-overlay" onClick={onClose}>
      <div
        className="paper-viewer-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="paper-viewer-header">
          <div style={{ minWidth: 0, flex: 1, paddingRight: 8 }}>
            <h3 style={{ margin: 0, fontWeight: 700, color: '#0f172a' }} title={paper.subjectName}>
              {paper.subjectName}
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {paper.branchName || paper.branch?.toUpperCase()} • Sem {paper.semester} • {paper.examType === 'internal-1' ? 'Internal 1' : paper.examType === 'internal-2' ? 'Internal 2' : 'External'} • {paper.year}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              className="btn btn-secondary btn-print-hide"
              style={{ padding: '6px 10px', fontSize: '0.82rem' }}
              onClick={() => window.print()}
              title="Print Paper"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            <button
              className="btn btn-primary"
              style={{ padding: '7px 12px', fontSize: '0.84rem' }}
              onClick={() => onDownload(paper)}
              title="Download Paper"
            >
              <Download size={15} />
              <span>Download</span>
            </button>

            <button
              className="close-btn"
              onClick={onClose}
              title="Close Viewer"
              style={{ padding: 6, borderRadius: 6 }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="paper-viewer-body">
          {previewImageUrl && !useIframe && !imgLoadError ? (
            <div style={{ width: '100%', textAlign: 'center', margin: 'auto 0' }}>
              <img
                src={previewImageUrl}
                alt={paper.subjectName}
                className="paper-viewer-doc-img"
                onError={() => {
                  setImgLoadError(true);
                  setUseIframe(true);
                }}
                style={{
                  maxWidth: `${zoom}%`,
                  width: zoom === 100 ? '100%' : 'auto',
                  borderRadius: 8,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                  background: 'white',
                  display: 'inline-block',
                  transition: 'max-width 0.15s ease',
                }}
              />
            </div>
          ) : fileSource ? (
            <div style={{ width: '100%', height: '100%', minHeight: 480, display: 'flex', flexDirection: 'column' }}>
              {isCloudinary && isPdf && (
                <div
                  style={{
                    background: '#1e293b',
                    color: '#94a3b8',
                    padding: '8px 12px',
                    borderRadius: '8px 8px 0 0',
                    fontSize: '0.78rem',
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
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                      }}
                    >
                      Document View
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
                  minHeight: 450,
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
                padding: 30,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                maxWidth: 420,
                margin: 'auto',
              }}
            >
              <FileText size={44} color="#1d4ed8" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 6, color: '#0f172a' }}>
                {paper.subjectName}
              </h4>
              <p style={{ color: '#64748b', marginBottom: 16, fontSize: '0.85rem' }}>
                Jharkhand University of Technology (JUT) Examination Paper • Chaibasa Engineering College
              </p>
              <button className="btn btn-primary" onClick={() => onDownload(paper)} style={{ width: '100%' }}>
                <Download size={15} />
                <span>Download Paper</span>
              </button>
            </div>
          )}
        </div>

        {/* Responsive Bottom Controls Bar */}
        <div className="paper-viewer-footer">
          {/* Zoom controls */}
          {previewImageUrl && !useIframe && (
            <div className="viewer-zoom-bar" style={{ display: 'flex', alignItems: 'center', background: '#334155', borderRadius: 8, padding: '2px 4px', gap: 2 }}>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                style={{ border: 'none', background: 'transparent', padding: '6px 8px', cursor: 'pointer', borderRadius: 4, display: 'flex' }}
              >
                <ZoomOut size={15} color="#e2e8f0" />
              </button>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc', minWidth: 42, textAlign: 'center' }}>
                {zoom}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                style={{ border: 'none', background: 'transparent', padding: '6px 8px', cursor: 'pointer', borderRadius: 4, display: 'flex' }}
              >
                <ZoomIn size={15} color="#e2e8f0" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset Zoom"
                style={{ border: 'none', background: 'transparent', padding: '6px 8px', cursor: 'pointer', borderRadius: 4, display: 'flex' }}
              >
                <RotateCcw size={13} color="#94a3b8" />
              </button>
            </div>
          )}

          {/* Quick External Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {cloudinaryPngUrl && (
              <button
                onClick={() => setUseIframe(!useIframe)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '5px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {useIframe ? 'Switch to Document View' : 'PDF Reader View'}
              </button>
            )}
            {fileSource && (
              <a
                href={fileSource}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '5px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>New Tab</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

