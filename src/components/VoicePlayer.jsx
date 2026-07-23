import React, { useState, useEffect, useRef } from 'react'

function VoicePlayer({ text }) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (!window.speechSynthesis) {
      setSupported(false)
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const toggleSpeech = () => {
    if (!supported) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    }
  }

  if (!supported) return null

  return (
    <div className="voice-controls">
      <button 
        className={`btn ${speaking ? 'btn-primary' : 'btn-secondary'}`}
        onClick={toggleSpeech}
      >
        {speaking ? 'Stop' : 'Listen'}
      </button>
    </div>
  )
}

export default VoicePlayer
