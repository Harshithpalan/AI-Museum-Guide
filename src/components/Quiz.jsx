import React, { useState, useEffect } from 'react'
import { generateQuiz } from '../utils/ai'

function Quiz({ artworkData, onComplete, onExit }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const generatedQuestions = await generateQuiz(artworkData)
      setQuestions(generatedQuestions)
      setLoading(false)
    } catch (err) {
      console.error('Failed to generate quiz:', err)
      setQuestions(getDefaultQuestions())
      setLoading(false)
    }
  }

  const getDefaultQuestions = () => [
    {
      question: `Who painted "${artworkData.title}"?`,
      options: [artworkData.artist, 'Pablo Picasso', 'Vincent van Gogh', 'Claude Monet'],
      correct: 0
    },
    {
      question: `What style is "${artworkData.title}"?`,
      options: [artworkData.style, 'Impressionism', 'Cubism', 'Surrealism'],
      correct: 0
    },
    {
      question: `When was "${artworkData.title}" painted?`,
      options: [artworkData.year, '1500', '1800', '1950'],
      correct: 0
    }
  ]

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(index)
    setShowResult(true)

    const isCorrect = index === questions[currentQuestion].correct
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }))
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        onComplete({
          correct: score.correct + (isCorrect ? 1 : 0),
          total: questions.length
        })
      }
    }, 1500)
  }

  if (loading) {
    return (
      <div className="quiz-section">
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating quiz questions...</p>
        </div>
      </div>
    )
  }

  if (!questions.length) return null

  const question = questions[currentQuestion]

  return (
    <div className="quiz-section">
      <div className="quiz-header">
        <h2>Quiz Mode</h2>
        <div className="quiz-progress">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${
                i < currentQuestion
                  ? (score.correct > i ? 'correct' : 'wrong')
                  : i === currentQuestion ? 'current' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <div className="question-card">
        <h3>Question {currentQuestion + 1} of {questions.length}</h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{question.question}</p>
        
        <div className="options-grid">
          {question.options.map((option, i) => (
            <button
              key={i}
              className={`option-btn ${
                showResult
                  ? i === question.correct
                    ? 'correct'
                    : i === selectedAnswer
                    ? 'wrong'
                    : ''
                  : ''
              }`}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="btn btn-secondary" onClick={onExit}>
          Exit Quiz
        </button>
      </div>
    </div>
  )
}

export default Quiz
