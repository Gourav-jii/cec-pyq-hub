import React from 'react';
import { Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="clean-footer">
      <div className="main-container footer-simple-inner">
        {/* Left: Brand & Credit */}
        <div className="footer-simple-brand">
          <div className="brand-badge">
            <img 
              src="/college-logo.png" 
              alt="CEC Logo" 
              className="footer-simple-logo" 
            />
            <div className="brand-names">
              <strong>CEC PYQ Hub</strong>
              <span className="dot-sep">•</span>
              <span>Chaibasa Engineering College</span>
            </div>
          </div>
          <p className="footer-simple-sub">
            Built with <Heart size={13} className="inline-heart" fill="#ef4444" color="#ef4444" /> by{' '}
            <a 
              href="https://www.linkedin.com/in/gourav-swarnkar-17268a280/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="dev-name-link"
            >
              Gourav Swarnkar
            </a>
          </p>
        </div>

        {/* Right: Clean Social & Contact Icons */}
        <div className="footer-simple-actions">
          <div className="footer-social-row">
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/gourav-swarnkar-17268a280/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-circle-link linkedin"
              title="LinkedIn Profile"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.77-1.72 1.72s.77 1.72 1.72 1.72 1.72-.77 1.72-1.72-.77-1.72-1.72-1.72Z"/>
              </svg>
            </a>

            {/* GitHub */}
            <a 
              href="https://github.com/Gourav-jii" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-circle-link github"
              title="GitHub Profile"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/_gourav.31__?obrf=cHRjaXhwMWhvNmpp" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-circle-link instagram"
              title="Instagram Profile"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            {/* Email */}
            <a 
              href="mailto:swarnkargourav31@gmail.com" 
              className="social-circle-link mail"
              title="Email: swarnkargourav31@gmail.com"
              aria-label="Contact Email"
            >
              <Mail size={17} />
            </a>
          </div>

          <span className="footer-simple-copy">© {currentYear} CEC PYQ Hub</span>
        </div>
      </div>
    </footer>
  );
}
