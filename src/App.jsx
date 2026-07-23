import { useState } from 'react'
import Header from './components/Header'
import Camera from './components/Camera'
import ArtworkAnalysis from './components/ArtworkAnalysis'
import Quiz from './components/Quiz'
import Welcome from './components/Welcome'
import ApiKeyModal from './components/ApiKeyModal'

function App() {
  const [mode, setMode] = useState('welcome')
  const [capturedImage, setCapturedImage] = useState(null)
  const [artworkData, setArtworkData] = useState(null)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)

  const handleCapture = (imageData) => {
    setCapturedImage(imageData)
    setMode('analyzing')
  }

  const handleAnalysisComplete = (data) => {
    setArtworkData(data)
    setMode('result')
  }

  const handleStartQuiz = () => {
    setMode('quiz')
  }

  const handleQuizComplete = (score) => {
    setMode('score')
    setArtworkData(prev => ({ ...prev, quizScore: score }))
  }

  const handleReset = () => {
    setCapturedImage(null)
    setArtworkData(null)
    setMode('welcome')
  }

  const handleSaveApiKey = (key) => {
    setApiKey(key)
    localStorage.setItem('openai_api_key', key)
    setShowApiKeyModal(false)
  }

  return (
    <div className="app-container">
      <Header 
        mode={mode} 
        onReset={handleReset}
        onSettingsClick={() => setShowApiKeyModal(true)}
      />

      {mode === 'welcome' && (
        <Welcome onStart={() => setMode('camera')} />
      )}

      {mode === 'camera' && (
        <Camera onCapture={handleCapture} />
      )}

      {(mode === 'analyzing' || mode === 'result') && (
        <ArtworkAnalysis
          image={capturedImage}
          apiKey={apiKey}
          onComplete={handleAnalysisComplete}
          artworkData={artworkData}
          onStartQuiz={handleStartQuiz}
          isLoading={mode === 'analyzing'}
        />
      )}

      {mode === 'quiz' && artworkData && (
        <Quiz
          artworkData={artworkData}
          onComplete={handleQuizComplete}
          onExit={handleReset}
        />
      )}

      {mode === 'score' && (
        <div className="score-screen">
          <h2>Quiz Complete!</h2>
          <div className="score-value">{artworkData.quizScore.correct}/{artworkData.quizScore.total}</div>
          <p className="score-message">
            {artworkData.quizScore.correct === artworkData.quizScore.total
              ? "Perfect score! You're an art expert!"
              : artworkData.quizScore.correct >= artworkData.quizScore.total / 2
              ? "Great job! Keep learning about art!"
              : "Keep exploring and learning!"}
          </p>
          <button className="btn btn-primary" onClick={handleReset}>
            Scan Another Artwork
          </button>
        </div>
      )}

      {showApiKeyModal && (
        <ApiKeyModal
          currentKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setShowApiKeyModal(false)}
        />
      )}
    </div>
  )
}

export default App
