import React from 'react';
import { X, BookOpen, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function SyllabusModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        <div className="modal-header">
          <h2>
            <BookOpen size={22} color="var(--primary)" />
            <span>JUT Exam Pattern & Syllabus Guide</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header notice */}
          <div style={{ padding: 14, background: 'rgba(37, 99, 235, 0.08)', borderRadius: 10, border: '1px solid rgba(37, 99, 235, 0.2)', marginBottom: 20 }}>
            <h4 style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
              Chaibasa Engineering College (Affiliated with JUT Ranchi)
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Follows AICTE model curriculum adapted by Jharkhand University of Technology for all B.Tech degree branches.
            </p>
          </div>

          {/* Exam Mark Distribution */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Theory Paper Evaluation (100 Marks Total):</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 16, background: 'var(--bg-surface-elevated)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>70 Marks</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>End-Semester Examination</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Conducted by JUT at college examination center. Duration: 3 Hours. 5 questions to be answered.
              </div>
            </div>

            <div style={{ padding: 16, background: 'var(--bg-surface-elevated)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>30 Marks</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>Internal Evaluation</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                20 marks Mid-Sem exam + 5 marks teacher assessment / assignments + 5 marks attendance.
              </div>
            </div>
          </div>

          {/* Passing Criteria Rules */}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>Passing Threshold:</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span><strong>End-Sem Minimum:</strong> At least 25 marks out of 70 (~35%) in the external paper.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span><strong>Aggregate Minimum:</strong> At least 40 marks out of 100 overall (Internal + External combined).</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span><strong>Practical / Lab Exams:</strong> 50% minimum passing mark (25 out of 50).</span>
            </li>
          </ul>

          {/* Quick study tips */}
          <div style={{ padding: 14, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 10, border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--text-main)', fontSize: '0.84rem', lineHeight: 1.5 }}>
            <strong style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <AlertTriangle size={15} /> Exam Strategy Tip:
            </strong>
            Over 65% of numericals and theoretical questions in JUT end-sem exams are repeated from the past 4 years' papers. Practicing the PYQs in this portal is the quickest way to secure an SGPA of 8.0+.
          </div>
        </div>
      </div>
    </div>
  );
}
