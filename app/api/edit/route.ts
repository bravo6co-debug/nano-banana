import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { image, prompt } = body
    
    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
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
    
    // Remove data URI prefix if present
    if (image.includes('base64,')) {
      image = image.split('base64,')[1]
    }
    
    // Edit image using Nano Banana model
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: image,
                mimeType: 'image/png'
              }
            },
            { text: prompt }
          ]
        }
      ]
    })
    
    // Extract edited image from response
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
        { error: 'Failed to edit image', details: 'No image data in response' },
        { status: 500 }
      )
    }
    
    const imageId = Date.now().toString(36) + Math.random().toString(36).substr(2)
    const tags = prompt.split(',').map((tag: string) => tag.trim()).filter(Boolean).slice(0, 5)
    
    return NextResponse.json({
      id: imageId,
      prompt,
      description: description || 'Image edited successfully',
      editType: 'text-guided',
      timestamp: Date.now(),
      imageBase64,
      tags,
      success: true
    })
    
  } catch (error) {
    console.error('Edit error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to edit image'
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    )
  }
}