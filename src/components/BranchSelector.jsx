import React from 'react';
import { 
  GraduationCap, 
  Laptop, 
  Cpu, 
  Zap, 
  Wrench, 
  Building2, 
  BookOpen 
} from 'lucide-react';
import { BRANCHES } from '../data/initialData';

const ICON_MAP = {
  GraduationCap,
  Laptop,
  Cpu,
  Zap,
  Wrench,
  Building2,
  BookOpen,
};

export default function BranchSelector({ selectedBranch, onSelectBranch, papersCountByBranch }) {
  return (
    <div className="branch-grid">
      {BRANCHES.map((b) => {
        const IconComponent = ICON_MAP[b.icon] || GraduationCap;
        const isSelected = selectedBranch === b.id;
        const count = papersCountByBranch[b.id] || 0;

        return (
          <button
            key={b.id}
            className={`branch-card ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectBranch(b.id)}
          >
            <div 
              className="branch-icon-box"
              style={{
                backgroundColor: isSelected ? b.color : `${b.color}18`,
                color: isSelected ? '#ffffff' : b.color,
              }}
            >
              <IconComponent size={20} />
            </div>
            <div className="branch-info">
              <h3>{b.short}</h3>
              <span>{count} {count === 1 ? 'Paper' : 'Papers'}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
