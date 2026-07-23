import React, { useEffect, useState } from 'react'
import { analyzeArtwork } from '../utils/ai'
import VoicePlayer from './VoicePlayer'

function ArtworkAnalysis({ image, apiKey, onComplete, artworkData, onStartQuiz, isLoading }) {
  const [loading, setLoading] = useState(isLoading)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isLoading && !artworkData) {
      analyzeImage()
    }
  }, [])

  const analyzeImage = async () => {
    if (!apiKey) {
      setError('Please set your OpenAI API key in Settings.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await analyzeArtwork(image, apiKey)
      onComplete(result)
    } catch (err) {
      setError(err.message || 'Failed to analyze artwork')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="camera-section">
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing artwork...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="camera-section">
        <div className="loading">
          <p style={{ color: '#f44336' }}>{error}</p>
          <button className="btn btn-primary" onClick={analyzeImage}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!artworkData) return null

  return (
    <div className="result-section">
      <img src={image} alt="Artwork" className="image-preview" />
      
      <h2 className="artwork-title">{artworkData.title}</h2>
      <p style={{ opacity: 0.7, marginBottom: '15px' }}>
        by {artworkData.artist} ({artworkData.year})
      </p>
      
      <div className="artwork-info">
        <p><strong>Style:</strong> {artworkData.style}</p>
        <p><strong>Museum:</strong> {artworkData.museum || 'Unknown'}</p>
        <p style={{ marginTop: '15px' }}>{artworkData.description}</p>
      </div>

      <VoicePlayer text={`${artworkData.title} by ${artworkData.artist}. ${artworkData.description}`} />

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onStartQuiz}>
          Start Quiz
        </button>
        <button className="btn btn-secondary" onClick={analyzeImage}>
          Re-analyze
        </button>
      </div>
    </div>
  )
}

export default ArtworkAnalysis
