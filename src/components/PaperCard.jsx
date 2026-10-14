import React from 'react';
import { Eye, Download, Trash2, Calendar, FileText } from 'lucide-react';
import { BRANCHES } from '../data/initialData';

export default function PaperCard({
  paper,
  currentUser,
  onView,
  onDownload,
  onDelete,
}) {
  const branchObj = BRANCHES.find((b) => b.id === paper.branch) || {
    short: paper.branch?.toUpperCase(),
  };

  const isOwner = currentUser && (currentUser.email === paper.uploaderEmail || currentUser.name === paper.uploaderName);

  return (
    <div className="simple-card">
      <div>
        {/* Badges */}
        <div className="card-badges">
          <span className="tag-branch">{branchObj.short}</span>
          <span className="tag-sem">Semester {paper.semester}</span>
          <span className="tag-year">
            <Calendar size={12} style={{ marginRight: 3, verticalAlign: -1 }} />
            {paper.year}
          </span>
          <span className="tag-sem">{paper.examType === 'mid-sem' ? 'Mid-Sem' : 'End-Sem'}</span>
        </div>

        {/* Title */}
        <h3 className="card-subject">{paper.subjectName}</h3>
        {paper.subjectCode && (
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 6, fontWeight: 600 }}>
            Code: {paper.subjectCode}
          </div>
        )}

        <div className="card-meta">
          <FileText size={13} style={{ verticalAlign: -1, marginRight: 4 }} />
          Uploaded by <strong>{paper.uploaderName || 'Student'}</strong> • {paper.uploadedAt || 'Recent'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-actions">
        <button 
          className="btn btn-primary" 
          style={{ flex: 1, padding: '7px 12px' }}
          onClick={() => onView(paper)}
        >
          <Eye size={15} />
          <span>View</span>
        </button>

        <button 
          className="btn btn-secondary" 
          style={{ padding: '7px 12px' }}
          onClick={() => onDownload(paper)}
          title="Download PDF"
        >
          <Download size={15} />
          <span>Download</span>
        </button>

        {isOwner && (
          <button 
            className="btn btn-danger" 
            style={{ padding: '7px 10px' }}
            onClick={() => onDelete(paper.id)}
            title="Delete this paper"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
