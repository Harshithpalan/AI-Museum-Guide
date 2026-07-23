const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function analyzeArtwork(imageBase64, apiKey) {
  const prompt = `Analyze this artwork and provide detailed information in JSON format with the following fields:
- title: The title of the artwork
- artist: The name of the artist
- year: The year or period when it was created
- style: The art style (e.g., Renaissance, Impressionism, Modern)
- museum: Where this artwork is currently located (if known)
- description: A detailed description of the artwork, its significance, and interesting facts (2-3 paragraphs)
- funFacts: An array of 3 interesting facts about this artwork

Important: Return ONLY the JSON object, no markdown formatting or additional text.`

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: imageBase64 }
            }
          ]
        }
      ],
      max_tokens: 1500
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to analyze artwork')
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  try {
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return {
      title: 'Unknown Artwork',
      artist: 'Unknown Artist',
      year: 'Unknown',
      style: 'Unknown',
      museum: 'Unknown',
      description: content,
      funFacts: []
    }
  }
}

export async function generateQuiz(artworkData) {
  const prompt = `Based on this artwork information, generate 5 quiz questions with 4 options each.

Artwork: ${artworkData.title}
Artist: ${artworkData.artist}
Year: ${artworkData.year}
Style: ${artworkData.style}
Description: ${artworkData.description}

Return a JSON array with questions in this format:
[
  {
    "question": "Question text?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct": 0
  }
]

The "correct" field should be the index (0-3) of the correct answer.
Return ONLY the JSON array, no markdown formatting.`

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    throw new Error('Failed to generate quiz')
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}
