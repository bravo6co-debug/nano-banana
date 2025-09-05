'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Download, Loader2, Image as ImageIcon, RefreshCw, Maximize2 } from 'lucide-react'

export function ImageCanvas() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  const {
    currentImage,
    isGenerating,
    error,
    selectedPrompts,
    customPrompt,
    uploadedImages
  } = useAppStore()
  
  const combinedPrompt = [...selectedPrompts, customPrompt].filter(Boolean).join(', ')
  
  const handleDownload = () => {
    if (!currentImage?.imageUrl && !currentImage?.imageBase64) return
    
    const link = document.createElement('a')
    link.href = currentImage.imageUrl || `data:image/png;base64,${currentImage.imageBase64}`
    link.download = `nano-banana-${currentImage.id}.png`
    link.click()
  }
  
  const handleGenerate = async () => {
    if (!combinedPrompt && uploadedImages.length === 0) return
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: combinedPrompt,
          images: uploadedImages
        })
      })
      
      if (!response.ok) {
        throw new Error('Generation failed')
      }
      
      const data = await response.json()
      // Handle response
    } catch (error) {
      console.error('Generation error:', error)
    }
  }
  
  return (
    <div className={cn(
      "flex flex-col bg-card rounded-lg border",
      isFullscreen ? "fixed inset-4 z-50" : "h-full"
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          생성 결과
        </h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          {currentImage && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {isGenerating ? (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">이미지 생성 중...</p>
          </div>
        ) : currentImage ? (
          <div className="max-w-full max-h-full">
            {currentImage.imageUrl ? (
              <img
                src={currentImage.imageUrl}
                alt={currentImage.prompt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            ) : currentImage.imageBase64 ? (
              <img
                src={`data:image/png;base64,${currentImage.imageBase64}`}
                alt={currentImage.prompt}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="p-8 bg-muted rounded-lg">
                <p className="text-center text-muted-foreground">
                  이미지를 생성할 수 없습니다
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">생성된 이미지가 없습니다</p>
            {(combinedPrompt || uploadedImages.length > 0) && (
              <Button onClick={handleGenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                이미지 생성
              </Button>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      
      {currentImage && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <div>프롬프트: {currentImage.prompt}</div>
            <div>생성 시간: {new Date(currentImage.timestamp).toLocaleString()}</div>
            {currentImage.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                태그:
                {currentImage.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}