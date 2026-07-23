import React from 'react'

function Header({ mode, onReset, onSettingsClick }) {
  return (
    <header className="header">
      <h1>AI Museum Guide</h1>
      <div className="nav-buttons">
        {mode !== 'welcome' && (
          <button className="btn btn-secondary" onClick={onReset}>
            Home
          </button>
        )}
        <button className="btn btn-secondary" onClick={onSettingsClick}>
          Settings
        </button>
      </div>
    </header>
  )
}

export default Header
