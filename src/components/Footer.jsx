import React from 'react';

export default function Footer() {
  return (
    <footer className="clean-footer">
      <div className="main-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <img src="/college-logo.png" alt="Logo" style={{ width: 28, height: 28, borderRadius: '50%' }} />
          <strong>CEC PYQ Hub • Chaibasa Engineering College</strong>
        </div>
        <div>
          Chaibasa Engineering College • Question Papers Hub
        </div>
      </div>
    </footer>
  );
}
