import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';

export default function GoogleAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const initializeGoogleAuth = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
              if (response.credential) {
                try {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64)
                      .split('')
                      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                      .join('')
                  );
                  const payload = JSON.parse(jsonPayload);

                  const user = {
                    name: payload.name || 'Google User',
                    email: payload.email,
                    avatar: payload.picture,
                    googleId: payload.sub,
                    verified: payload.email_verified,
                    loginProvider: 'google',
                  };

                  onLoginSuccess(user);
                  onClose();
                } catch (err) {
                  console.error('Error decoding Google JWT credential:', err);
                }
              }
            },
            auto_select: false,
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'rectangular',
              text: 'signin_with',
              logo_alignment: 'left',
              width: 320,
            });
          }

          // Also trigger One Tap prompt
          window.google.accounts.id.prompt();
        } catch (e) {
          console.warn('Google Identity initialization error:', e);
        }
      }
    };

    // If script not loaded yet, retry shortly
    if (!window.google?.accounts?.id) {
      const timer = setTimeout(initializeGoogleAuth, 300);
      return () => clearTimeout(timer);
    } else {
      initializeGoogleAuth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420, padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Google Logo */}
            <svg viewBox="0 0 48 48" style={{ width: 24, height: 24 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>Sign in with Google</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '28px 24px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.92rem', color: '#4b5563', marginBottom: 24, lineHeight: 1.5 }}>
            Apne official Google account se <strong>CEC PYQ Hub</strong> me login karein.
          </p>

          {/* Official Google Sign-In Button Container */}
          <div style={{ display: 'flex', justifyContent: 'center', minHeight: 46 }}>
            <div ref={googleBtnRef} id="officialGoogleButton" />
          </div>

          <div style={{ marginTop: 24, fontSize: '0.78rem', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={15} color="#10b981" />
            <span>Authenticated directly via Google Cloud OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
