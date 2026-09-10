import React, { useState } from 'react';
import { X, HelpCircle, ThumbsUp, Send, PlusCircle } from 'lucide-react';
import { BRANCHES } from '../data/initialData';

export default function RequestPaperModal({
  isOpen,
  onClose,
  requests,
  currentUser,
  onAddRequest,
  onVoteRequest,
  onOpenUpload,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [branch, setBranch] = useState('cse');
  const [semester, setSemester] = useState(4);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const branchObj = BRANCHES.find((b) => b.id === branch);

    const newReq = {
      id: `req-${Date.now()}`,
      subject: subject.trim(),
      branch: branch,
      branchName: branchObj ? branchObj.short : branch.toUpperCase(),
      semester: Number(semester),
      requestedBy: currentUser?.name || 'Anonymous Student',
      requestedAt: 'Just now',
      votes: 1,
      status: 'Open',
    };

    onAddRequest(newReq);
    setSubject('');
    setShowAddForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 600 }}
      >
        <div className="modal-header">
          <h2>
            <HelpCircle size={22} color="var(--primary)" />
            <span>Request Missing PYQ Papers</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
              Need a paper not currently in our archive? Post your request here.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <PlusCircle size={15} />
              <span>{showAddForm ? 'Close Form' : 'New Request'}</span>
            </button>
          </div>

          {/* Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} style={{ background: 'var(--bg-surface-elevated)', padding: 16, borderRadius: 10, marginBottom: 20, border: '1px solid var(--border-subtle)' }}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Subject & Exam Detail *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Compiler Design End-Sem 2023 or Thermodynamics Mid-Sem"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2" style={{ marginBottom: 14 }}>
                <div>
                  <label className="form-label">Branch</label>
                  <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                    {BRANCHES.filter((b) => b.id !== 'all').map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Semester</label>
                  <select className="form-select" value={semester} onChange={(e) => setSemester(e.target.value)}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '9px' }}>
                <Send size={15} />
                <span>Submit Request to College Community</span>
              </button>
            </form>
          )}

          {/* Requests list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {requests.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface-elevated)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge-branch" style={{ background: 'rgba(37, 99, 235, 0.15)', color: '#3b82f6', fontSize: '0.72rem' }}>
                      {r.branchName}
                    </span>
                    <span className="badge-sem" style={{ fontSize: '0.72rem' }}>Sem {r.semester}</span>
                    <span style={{ fontSize: '0.75rem', color: r.status === 'Fulfilled' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                      ● {r.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '2px 0' }}>{r.subject}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                    Requested by {r.requestedBy} • {r.requestedAt}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button 
                    className="btn-upvote" 
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                    onClick={() => onVoteRequest(r.id)}
                    title="I also need this paper"
                  >
                    <ThumbsUp size={13} />
                    <span>{r.votes || 1}</span>
                  </button>

                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                    onClick={() => {
                      onClose();
                      onOpenUpload();
                    }}
                    title="I have this paper to upload"
                  >
                    <span>I have this!</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
