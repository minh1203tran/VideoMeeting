"use client"

export default function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">▶</div>
          <h1 className="logo-text">AI Meet</h1>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="grid-layout">
            {/* Left Section */}
            <div className="left-section">
              <div>
                <h2 className="section-title">Meet Smarter with AI</h2>
                <p className="section-description">
                  Crystal clear video calls, real-time transcription, and AI-powered meeting summaries all in one place.
                </p>
              </div>

              <div className="button-group">
                <a href="/meeting" className="btn btn-primary">
                  Start Meeting
                </a>
                <button className="btn btn-secondary">Schedule</button>
              </div>

              {/* Features List */}
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span className="feature-text">High-definition video</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span className="feature-text">AI transcription & notes</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✓</div>
                  <span className="feature-text">Screen sharing & recording</span>
                </div>
              </div>
            </div>

            {/* Right Section - Preview */}
            <div className="right-section">
              <div className="preview-box">
                <div className="preview-content">
                  <div className="preview-icon">📹</div>
                  <p className="preview-text">Ready for your meeting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2025 AI Meet. Powered by advanced AI technology.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}