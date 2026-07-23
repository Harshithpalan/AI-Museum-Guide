import React from 'react'

function Welcome({ onStart }) {
  return (
    <div className="welcome-screen">
      <h2>Welcome to AI Museum Guide</h2>
      <p>
        Point your camera at any painting and let AI explain the artwork,
        its history, and the artist behind it. Perfect for museum visits
        and art students!
      </p>
      <button className="btn btn-primary" onClick={onStart}>
        Start Scanning
      </button>

      <div className="feature-cards">
        <div className="feature-card">
          <h3>📸 Art Recognition</h3>
          <p>Simply point your camera at any painting to get instant information about the artwork.</p>
        </div>
        <div className="feature-card">
          <h3>🎙️ Voice Narration</h3>
          <p>Listen to detailed explanations while you admire the artwork hands-free.</p>
        </div>
        <div className="feature-card">
          <h3>🎓 Quiz Mode</h3>
          <p>Test your knowledge with fun quizzes about the artwork you've learned about.</p>
        </div>
      </div>
    </div>
  )
}

export default Welcome
