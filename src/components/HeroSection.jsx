import React from 'react';
import { Search, X } from 'lucide-react';

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  currentUser,
}) {
  return (
    <div className="student-dashboard-header">
      {/* Title & Subtitle */}
      <div className="dashboard-top-row">
        <div>
          <h2 className="dashboard-title">
            Welcome, {currentUser?.name || 'Student'}
          </h2>
          <p className="dashboard-subtitle">
            Chaibasa Engineering College • Browse, download, or search past year question papers
          </p>
        </div>
      </div>

      {/* Standalone Clean Search Bar */}
      <div className="search-bar-wrap">
        <Search size={18} className="search-icon-svg" />
        <input
          type="text"
          className="search-input-field"
          placeholder="Search by subject name (e.g. DBMS, DAA, Mathematics, Operating Systems, Surveying)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
