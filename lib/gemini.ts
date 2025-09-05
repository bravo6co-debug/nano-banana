import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiClient {
  private ai: GoogleGenerativeAI | null = null
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.ai = new GoogleGenerativeAI(apiKey)
    }
  }
  
  async generateImage(prompt: string, images: string[] = []) {
    if (!this.ai) {
      throw new Error('Gemini API key not configured')
    }
    
    const model = this.ai.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      }
    })
    
    try {
      // Prepare contents based on whether we have images
      const parts = []
      
      // Add images if provided
      if (images.length > 0) {
        for (const imageBase64 of images) {
          parts.push({
            inlineData: {
              data: imageBase64,
              mimeType: 'image/png'
            }
          })
        }
      }
      
      // Add text prompt
      parts.push({ text: prompt })
      
      const result = await model.generateContent(parts)
      const response = await result.response
      const text = response.text()
      
      // For now, return the text response
      // In production, this would handle actual image generation
      return {
        success: true,
        text,
        imageUrl: null // Placeholder for actual image URL
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }
  
  async editImage(imageBase64: string, prompt: string) {
    return this.generateImage(prompt, [imageBase64])
  }
  
  async synthesizeImages(images: string[], prompt: string) {
    return this.generateImage(prompt, images)
  }
}