'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  compact?: boolean
  showHeader?: boolean
  showActions?: boolean
}

export function UploadZone({ compact = false, showHeader = true, showActions = true }: UploadZoneProps) {
  const { 
    uploadedImages, 
    addUploadedImage, 
    removeUploadedImage, 
    clearUploadedImages,
    isGenerating,
    setIsGenerating,
    addGeneratedImage,
    setError,
    customPrompt
  } = useAppStore()
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1]
        if (base64) {
          addUploadedImage(base64)
        }
      }
      reader.readAsDataURL(file)
    })
  }, [addUploadedImage])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    disabled: isGenerating
  })
  
  const handleEditImage = async () => {
    if (uploadedImages.length === 0 || !customPrompt || isGenerating) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImages[0], // Use first uploaded image
          prompt: customPrompt || 'Enhance this image'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to edit image')
      }
      
      const data = await response.json()
      
      addGeneratedImage({
        id: data.id,
        prompt: data.prompt,
        imageUrl: null,
        imageBase64: data.imageBase64,
        timestamp: data.timestamp,
        tags: data.tags || []
      })
    } catch (error) {
      console.error('Edit error:', error)
      setError(error instanceof Error ? error.message : 'Failed to edit image')
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleSynthesizeImages = async () => {
    if (uploadedImages.length < 2 || isGenerating) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: uploadedImages,
          prompt: customPrompt || 'Combine these images naturally'
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to synthesize images')
      }
      
      const data = await response.json()
      
      addGeneratedImage({
        id: data.id,
        prompt: data.prompt,
        imageUrl: null,
        imageBase64: data.imageBase64,
        timestamp: data.timestamp,
        tags: data.tags || []
      })
    } catch (error) {
      console.error('Synthesis error:', error)
      setError(error instanceof Error ? error.message : 'Failed to synthesize images')
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <div className={cn(
      "flex flex-col bg-card rounded-lg border p-4",
      compact ? "h-auto" : "h-full"
    )}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Upload className="w-5 h-5" />
            이미지 업로드
          </h2>
          {uploadedImages.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearUploadedImages}
              disabled={isGenerating}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          "flex items-center justify-center",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isGenerating && "opacity-50 cursor-not-allowed",
          compact ? "min-h-[200px]" : "flex-1"
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center p-4">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            {isDragActive ? '여기에 놓으세요' : '이미지를 드래그하거나 클릭'}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, GIF, WEBP 지원
          </p>
        </div>
      </div>
      
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-muted-foreground mb-2">
            업로드된 이미지 ({uploadedImages.length}개)
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={`data:image/png;base64,${image}`}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  onClick={() => removeUploadedImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isGenerating}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showActions && (
        <div className="mt-4 space-y-2">
          {uploadedImages.length > 0 && !customPrompt && (
            <p className="text-xs text-muted-foreground text-center">
              ℹ️ 프롬프트를 입력하면 이미지를 편집할 수 있습니다
            </p>
          )}
          <Button
            className="w-full"
            variant="outline"
            onClick={handleEditImage}
            disabled={uploadedImages.length === 0 || !customPrompt || isGenerating}
            title={!customPrompt ? "프롬프트를 입력해주세요" : "이미지 편집"}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            이미지 편집
          </Button>
          {uploadedImages.length > 1 && (
            <Button
              className="w-full"
              variant="outline"
              onClick={handleSynthesizeImages}
              disabled={isGenerating}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              이미지 합성
            </Button>
          )}
        </div>
      )}
    </div>
  )
}