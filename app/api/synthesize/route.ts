import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { images, prompt } = body
    
    if (!images || images.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 images required for synthesis' },
        { status: 400 }
      )
    }
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }
    
    const ai = new GoogleGenAI({ apiKey })
    
    // Prepare parts with multiple images
    const parts = []
    
    // Add all images
    for (let imageBase64 of images) {
      // Remove data URI prefix if present
      if (imageBase64.includes('base64,')) {
        imageBase64 = imageBase64.split('base64,')[1]
      }
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png'
        }
      })
    }
    
    // Add synthesis instruction
    const synthesisPrompt = prompt || `Combine these ${images.length} images naturally, maintaining the best aspects of each`
    parts.push({ text: synthesisPrompt })
    
    // Synthesize images using Nano Banana model
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ]
    })
    
    // Extract synthesized image from response
    let imageBase64 = null
    let description = ''
    
    const candidates = res.candidates || []
    if (candidates.length > 0 && candidates[0].content) {
      const responseParts = candidates[0].content.parts || []
      
      for (const part of responseParts) {
        if (part.inlineData?.data) {
          imageBase64 = part.inlineData.data
        }
        if (part.text) {
          description = part.text
        }
      }
    }
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Failed to synthesize images', details: 'No image data in response' },
        { status: 500 }
      )
    }
    
    const imageId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    
    return NextResponse.json({
      id: imageId,
      prompt: synthesisPrompt,
      description: description || 'Images synthesized successfully',
      imageCount: images.length,
      timestamp: Date.now(),
      imageBase64,
      tags: ['synthesis', `${images.length}-images`],
      success: true
    })
    
  } catch (error) {
    console.error('Synthesis error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to synthesize images'
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    )
  }
}