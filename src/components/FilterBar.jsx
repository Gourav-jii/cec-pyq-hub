import React from 'react';
import { BRANCHES, SEMESTERS } from '../data/initialData';

export default function FilterBar({
  selectedBranch,
  setSelectedBranch,
  selectedSemester,
  setSelectedSemester,
}) {
  return (
    <div className="filter-container">
      {/* Branch Filter */}
      <div style={{ marginBottom: 14 }}>
        <div className="filter-group-title">Select Branch / Department:</div>
        <div className="filter-pills-row">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              className={`filter-pill ${selectedBranch === b.id ? 'active' : ''}`}
              onClick={() => setSelectedBranch(b.id)}
            >
              {b.short}
            </button>
          ))}
        </div>
      </div>

      {/* Semester Filter */}
      <div>
        <div className="filter-group-title">Select Semester:</div>
        <div className="filter-pills-row">
          {SEMESTERS.map((s) => (
            <button
              key={s.value}
              className={`filter-pill ${selectedSemester === s.value ? 'active' : ''}`}
              onClick={() => setSelectedSemester(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
