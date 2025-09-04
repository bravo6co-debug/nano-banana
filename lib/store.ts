import { create } from 'zustand'

export interface GeneratedImage {
  id: string
  prompt: string
  imageUrl: string | null
  imageBase64?: string
  timestamp: number
  parentId?: string
  tags: string[]
}

interface AppState {
  // Prompt composition
  selectedPrompts: string[]
  customPrompt: string
  
  // Images
  uploadedImages: string[]
  generatedImages: GeneratedImage[]
  currentImage: GeneratedImage | null
  
  // UI State
  isGenerating: boolean
  error: string | null
  
  // Actions
  addPrompt: (prompt: string) => void
  removePrompt: (prompt: string) => void
  clearPrompts: () => void
  setCustomPrompt: (prompt: string) => void
  
  addUploadedImage: (imageBase64: string) => void
  removeUploadedImage: (index: number) => void
  clearUploadedImages: () => void
  
  addGeneratedImage: (image: GeneratedImage) => void
  setCurrentImage: (image: GeneratedImage | null) => void
  
  setIsGenerating: (isGenerating: boolean) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  selectedPrompts: [],
  customPrompt: '',
  uploadedImages: [],
  generatedImages: [],
  currentImage: null,
  isGenerating: false,
  error: null,
  
  // Actions
  addPrompt: (prompt) =>
    set((state) => ({
      selectedPrompts: [...state.selectedPrompts, prompt]
    })),
    
  removePrompt: (prompt) =>
    set((state) => ({
      selectedPrompts: state.selectedPrompts.filter((p) => p !== prompt)
    })),
    
  clearPrompts: () =>
    set({ selectedPrompts: [] }),
    
  setCustomPrompt: (prompt) =>
    set({ customPrompt: prompt }),
    
  addUploadedImage: (imageBase64) =>
    set((state) => ({
      uploadedImages: [...state.uploadedImages, imageBase64]
    })),
    
  removeUploadedImage: (index) =>
    set((state) => ({
      uploadedImages: state.uploadedImages.filter((_, i) => i !== index)
    })),
    
  clearUploadedImages: () =>
    set({ uploadedImages: [] }),
    
  addGeneratedImage: (image) =>
    set((state) => ({
      generatedImages: [image, ...state.generatedImages],
      currentImage: image
    })),
    
  setCurrentImage: (image) =>
    set({ currentImage: image }),
    
  setIsGenerating: (isGenerating) =>
    set({ isGenerating }),
    
  setError: (error) =>
    set({ error })
}))