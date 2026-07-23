import React, { useState } from 'react'

function ApiKeyModal({ currentKey, onSave, onClose }) {
  const [key, setKey] = useState(currentKey)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(key.trim())
  }

  return (
    <div className="api-key-section" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, width: '90%', maxWidth: '400px' }}>
      <h3>Enter API Key</h3>
      <p style={{ marginBottom: '15px', opacity: 0.8, fontSize: '0.9rem' }}>
        Required for AI-powered artwork analysis. Get yours at{' '}
        <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#e94560' }}>
          openrouter.ai
        </a>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-..."
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            background: 'rgba(0,0,0,0.3)',
            color: 'var(--text)',
            fontSize: '1rem',
            marginBottom: '15px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default ApiKeyModal
