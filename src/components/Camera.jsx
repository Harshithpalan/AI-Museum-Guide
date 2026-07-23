import React, { useRef, useState, useEffect } from 'react'

function Camera({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [captured, setCaptured] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
      console.error('Camera error:', err)
    }
  }

  const captureImage = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL('image/jpeg')
      setCaptured(imageData)
    }
  }

  const confirmCapture = () => {
    if (captured) {
      onCapture(captured)
    }
  }

  const retake = () => {
    setCaptured(null)
  }

  if (error) {
    return (
      <div className="camera-section">
        <div className="loading">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={startCamera}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="camera-section">
      <div className="camera-container">
        {!captured ? (
          <video ref={videoRef} autoPlay playsInline />
        ) : (
          <img src={captured} alt="Captured artwork" className="captured-image" />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="camera-controls">
        {!captured ? (
          <button 
            className="capture-btn" 
            onClick={captureImage}
            disabled={!stream}
          />
        ) : (
          <>
            <button className="btn btn-secondary" onClick={retake}>
              Retake
            </button>
            <button className="btn btn-primary" onClick={confirmCapture}>
              Analyze Artwork
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Camera
