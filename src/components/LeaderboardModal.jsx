import React from 'react';
import { X, Trophy, Award, Star, Flame } from 'lucide-react';
import { TOP_CONTRIBUTORS } from '../data/initialData';

export default function LeaderboardModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 540 }}
      >
        <div className="modal-header">
          <h2>
            <Trophy size={22} color="#f59e0b" />
            <span>CEC Hall of Fame (Top Contributors)</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 20, color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700, marginBottom: 8 }}>
              <Flame size={15} />
              <span>Exam Saviors & Peer Heroes</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              These students helped hundreds of peers pass JUT semester exams by contributing original question papers & handwritten solutions.
            </p>
          </div>

          <div className="leaderboard-list">
            {TOP_CONTRIBUTORS.map((c) => (
              <div key={c.name} className="leaderboard-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className={`leaderboard-rank rank-${c.rank}`}>
                    {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : c.rank}
                  </div>
                  <img src={c.avatar} alt={c.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>{c.name}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{c.batch}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {c.papersUploaded} Uploads
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                    {c.totalDownloads} Downloads
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-surface-elevated)', borderRadius: 12, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: 4 }}>Want to see your name here?</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Login with Gmail, upload past mid-sem or end-sem question papers, and earn +50 points per paper!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
