import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, images = [], mode, editOption } = body
    
    if (!prompt && images.length === 0) {
      return NextResponse.json(
        { error: 'Prompt or images required' },
        { status: 400 }
      )
    }
    
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }
    
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Use Nano Banana model for image generation
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp'  // Using latest available model
    })
    
    try {
      // Prepare the prompt
      let finalPrompt = prompt
      
      // For edit mode, add context
      if (mode === 'edit' && images.length > 0) {
        // Process base64 images
        const imageParts = images.map((imageBase64: string) => {
          // Remove data URI prefix if present
          const base64Data = imageBase64.includes('base64,') 
            ? imageBase64.split('base64,')[1] 
            : imageBase64
            
          return {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png'
            }
          }
        })
        
        // Generate with image editing
        const result = await model.generateContent([
          ...imageParts,
          `Edit this image: ${finalPrompt}`
        ])
        
        const response = await result.response
        const text = response.text()
        
        // For edit mode, we return the text response
        // Actual image editing would require Imagen or other specialized API
        return NextResponse.json({
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          prompt: finalPrompt,
          description: text,
          tags: prompt.split(',').map((tag: string) => tag.trim()).filter(Boolean).slice(0, 5),
          timestamp: Date.now(),
          imageBase64: null, // Image editing not available in this model
          editResponse: text,
          success: true
        })
      } else {
        // Text-to-image generation
        // Note: Gemini 2.0 Flash doesn't generate images directly
        // We'll use it to create a detailed description
        const enhancedPrompt = `Create a detailed description for an image with the following specifications: ${finalPrompt}. Describe the scene, colors, composition, style, and mood in detail.`
        
        const result = await model.generateContent(enhancedPrompt)
        const response = await result.response
        const description = response.text()
        
        // Generate unique ID for the result
        const imageId = Date.now().toString(36) + Math.random().toString(36).substr(2)
        
        // Extract tags from prompt
        const tags = prompt.split(',').map((tag: string) => tag.trim()).filter(Boolean).slice(0, 5)
        
        // Return response with description
        // Note: For actual image generation, you would need to use Imagen API or similar
        return NextResponse.json({
          id: imageId,
          prompt: finalPrompt,
          description: description,
          tags,
          timestamp: Date.now(),
          imageBase64: null, // Placeholder - would contain actual image with Imagen API
          message: 'Image description generated. Note: Actual image generation requires Imagen API access.',
          success: true
        })
      }
    } catch (modelError: any) {
      console.error('Model generation error:', modelError)
      
      // Check for specific error types
      if (modelError.message?.includes('API key not valid')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your Gemini API key.' },
          { status: 401 }
        )
      }
      
      if (modelError.message?.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      
      throw modelError
    }
    
  } catch (error) {
    console.error('Generation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image'
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: process.env.NODE_ENV === 'development' ? error : undefined 
      },
      { status: 500 }
    )
  }
}