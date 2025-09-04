import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, images = [] } = body
    
    if (!prompt && images.length === 0) {
      return NextResponse.json(
        { error: 'Prompt or images required' },
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
    
    // Prepare content parts
    const parts = []
    
    // Add images if provided (for editing)
    if (images.length > 0) {
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
      // Add edit instruction
      parts.push({ text: `Edit this image: ${prompt}` })
    } else {
      // Text-to-image generation
      parts.push({ text: prompt })
    }
    
    // Generate image using Nano Banana model
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ]
    })
    
    // Extract image from response
    let imageBase64 = null
    let description = ''
    
    const candidates = res.candidates || []
    if (candidates.length > 0 && candidates[0].content) {
      const responseParts = candidates[0].content.parts || []
      
      // Find the inline image data
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
        { error: 'Failed to generate image', details: 'No image data in response' },
        { status: 500 }
      )
    }
    
    // Generate unique ID for the image
    const imageId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    
    // Extract tags from prompt
    const tags = prompt.split(',').map((tag: string) => tag.trim()).filter(Boolean).slice(0, 5)
    
    return NextResponse.json({
      id: imageId,
      prompt,
      description: description || 'Image generated successfully',
      tags,
      timestamp: Date.now(),
      imageBase64,
      success: true
    })
    
  } catch (error) {
    console.error('Generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    )
  }
}