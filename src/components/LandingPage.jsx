import React, { useState } from 'react';
import { 
  LogIn, 
  ArrowRight, 
  BookOpen, 
  Download, 
  UploadCloud, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  Laptop, 
  Cpu, 
  Zap, 
  Wrench, 
  Building2, 
  GraduationCap,
  Sparkles,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

export default function LandingPage({ onOpenAuth }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const branches = [
    { name: 'Computer Science & Engg', code: 'CSE', icon: Laptop, color: '#3b82f6', desc: 'DSA, DBMS, OS, DAA, Networks, AI/ML' },
    { name: 'Electronics & Communication', code: 'ECE', icon: Cpu, color: '#ec4899', desc: 'Analog, Digital Systems, DSP, Microprocessors' },
    { name: 'Electrical Engineering', code: 'EE', icon: Zap, color: '#eab308', desc: 'Circuits, Machines, Control Systems, Power Systems' },
    { name: 'Mechanical Engineering', code: 'ME', icon: Wrench, color: '#f97316', desc: 'Thermodynamics, SOM, Fluid Mechanics, Manufacturing' },
    { name: 'Civil Engineering', code: 'CE', icon: Building2, color: '#10b981', desc: 'Surveying, Concrete Structures, Geotechnical' },
  ];

  const faqs = [
    {
      q: 'Kya ye question papers JUT (Jharkhand University of Technology) ke syllabus ke anusaar hain?',
      a: 'Haan, CEC PYQ Hub par uploaded sabhi question papers Chaibasa Engineering College me hue official JUT external end-sem aur internal mid-sem examinations ke hain.'
    },
    {
      q: 'Papers download karne ke liye kya koi fee ya subscription lagta hai?',
      a: 'Nahi, ye platform 100% free hai. College ke sabhi students bina kisi charges ke direct PDF download kar sakte hain.'
    },
    {
      q: 'Main apna paper kaise upload kar sakta hu?',
      a: 'Apne Gmail account se login karein, upar diye gaye "Upload PYQ" button par click karein, apna branch, semester, subject name select karein aur PDF ya clear image file upload karein.'
    },
    {
      q: 'Kya main mid-sem aur lab viva ke questions bhi upload kar sakta hu?',
      a: 'Haan! Aap End-Sem, Mid-Sem (Internal) ya practice model papers me se choose kar ke upload kar sakte hain.'
    }
  ];

  return (
    <div className="landing-container-fluid">
      {/* 1. Fullscreen Video Hero Section */}
      <section className="video-hero-section">
        <div className="video-hero-wrapper">
          <iframe
            className="video-hero-iframe"
            src="https://player.cloudinary.com/embed/?cloud_name=djdwqcq1l&public_id=SSYouTube.online_Chaibasa_Engineering_College_Campus_Tour_Teaser_HD__Virtual_Tour__Campus_Tour_1080p_r2fhvn&player[autoplay]=true&player[muted]=true&player[loop]=true&player[controls]=false&player[hideContextMenu]=true"
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Chaibasa Engineering College Campus Tour"
          />
          <div className="video-hero-overlay" />

          <div className="video-hero-content">
            <h1 className="video-hero-title">Welcome to the CEC PYQ Hub</h1>
            <p className="video-hero-subtitle">
              Upload, explore, and download previous year question papers with ease. 
              Built for Chaibasa Engineering College students to excel in semester exams.
            </p>
            <button className="btn btn-primary video-hero-btn" onClick={onOpenAuth}>
              <span>Explore Now</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="main-container">
        {/* 2. Feature Highlights Strip */}
        <section className="features-highlight-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
              <BookOpen size={24} />
            </div>
            <h3>JUT Exam Papers</h3>
            <p>Access authentic past year end-sem and mid-sem question papers across 8 semesters.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
              <Download size={24} />
            </div>
            <h3>Free Instant Download</h3>
            <p>Download genuine PDF copies directly to your phone or laptop with zero waiting time.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
              <UploadCloud size={24} />
            </div>
            <h3>Student-Powered</h3>
            <p>Upload your past question papers in 1 click and help your batchmates and juniors score high.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
              <Layers size={24} />
            </div>
            <h3>Branch-Wise Filters</h3>
            <p>Find what you need instantly by filtering through branches, semesters, and exam years.</p>
          </div>
        </section>

        {/* 3. College Info Section (Exact as User Requested) */}
        <section className="landing-college-section">
          <div className="landing-image-col">
            <img 
              src="/college-campus.jpg" 
              alt="Chaibasa Engineering College Campus" 
              className="landing-campus-img"
            />
          </div>

          <div className="landing-info-col">
            <h2 className="landing-title">Chaibasa Engineering College</h2>
            <p className="landing-paragraph">
              Chaibasa Engineering College, established in 2013, is a premier institute in Jharkhand offering quality education in five key engineering disciplines: Civil, Computer Science, Electrical, Electronics & Communication, and Mechanical. With an annual intake of 420 students, the college is approved by AICTE and focuses on nurturing technically proficient and socially responsible engineers.
            </p>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span className="info-chip">Estd. 2013</span>
              <span className="info-chip">AICTE Approved</span>
              <span className="info-chip">Affiliated to JUT Ranchi</span>
              <span className="info-chip">Techno India Group</span>
            </div>
          </div>
        </section>

        {/* 4. Supported Engineering Branches */}
        <section className="landing-branches-section">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 className="section-heading">Supported Engineering Branches</h2>
            <p className="section-subheading">
              Question papers available for all B.Tech engineering branches across Sem 1 to Sem 8.
            </p>
          </div>

          <div className="branches-showcase-grid">
            {branches.map((b) => {
              const IconComponent = b.icon;
              return (
                <div key={b.code} className="branch-showcase-card">
                  <div className="branch-badge-icon" style={{ background: `${b.color}15`, color: b.color }}>
                    <IconComponent size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{b.code}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>• B.Tech</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                      {b.name}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. How It Works (3 Steps) */}
        <section className="how-it-works-section">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 className="section-heading">How CEC PYQ Hub Works</h2>
            <p className="section-subheading">Simple, fast, and student-focused exam revision in 3 steps.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4 className="step-title">Sign In with Gmail</h4>
              <p className="step-desc">Login securely using your Google account in one click with zero passwords to remember.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4 className="step-title">Select Branch & Semester</h4>
              <p className="step-desc">Browse through organized filters or use search to find the exact question paper you need.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4 className="step-title">View, Download or Upload</h4>
              <p className="step-desc">Preview questions in the browser, download PDF, or upload physical papers to help juniors.</p>
            </div>
          </div>
        </section>

        {/* 6. About Me Section (Gourav Swarnkar) */}
        <section className="landing-about-section">
          <h2 className="landing-title">About Me</h2>
          <p className="landing-paragraph">
            Hello! I'm Gourav Swarnkar, a student and developer at Chaibasa Engineering College. I built <strong>CEC PYQ Hub</strong> to help college students, batchmates, and juniors easily access previous year semester question papers and exam preparation resources in one organized place. I love developing impactful web platforms that solve real campus challenges.
          </p>
        </section>

        {/* 7. FAQ Section */}
        <section className="faq-section">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <p className="section-subheading">Common questions about CEC exam papers and downloads.</p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item" onClick={() => toggleFaq(idx)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }} 
                  />
                </div>
                {openFaq === idx && (
                  <div className="faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 8. Bottom Login Call to Action Bar */}
        <section className="landing-login-cta">
          <div className="cta-content">
            <div>
              <h3>Ready to Ace Your Semester Exams?</h3>
              <p>
                Sign in with your Gmail account to view papers across all branches and contribute your own question papers.
              </p>
            </div>
          </div>

          <button className="btn btn-primary cta-btn" onClick={onOpenAuth} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg viewBox="0 0 48 48" style={{ width: 20, height: 20 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </section>
      </div>
    </div>
  );
}
