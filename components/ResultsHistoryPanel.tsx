'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Download, 
  Loader2, 
  Image as ImageIcon, 
  RefreshCw, 
  Maximize2, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Grid3X3,
  List
} from 'lucide-react'

type ViewMode = 'current' | 'history'
type HistoryView = 'grid' | 'list'

export function ResultsHistoryPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>('current')
  const [historyView, setHistoryView] = useState<HistoryView>('grid')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const {
    currentImage,
    generatedImages,
    isGenerating,
    error,
    setCurrentImage,
    selectedPrompts,
    customPrompt,
    uploadedImages
  } = useAppStore()

  const combinedPrompt = [...selectedPrompts, customPrompt].filter(Boolean).join(', ')
  const hasContent = currentImage || generatedImages.length > 0

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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '방금 전'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn(
      "flex flex-col bg-card rounded-lg border",
      isFullscreen ? "fixed inset-4 z-50" : "h-full"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === 'current' ? 'default' : 'ghost'}
              onClick={() => setViewMode('current')}
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              현재 결과
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'history' ? 'default' : 'ghost'}
              onClick={() => setViewMode('history')}
            >
              <Clock className="w-4 h-4 mr-1" />
              히스토리
              {generatedImages.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 text-xs">
                  {generatedImages.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'history' && generatedImages.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={historyView === 'grid' ? 'default' : 'ghost'}
                onClick={() => setHistoryView('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={historyView === 'list' ? 'default' : 'ghost'}
                onClick={() => setHistoryView('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          
          {currentImage && viewMode === 'current' && (
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

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'current' ? (
          // Current Result View
          <div className="flex-1 flex items-center justify-center p-4">
            {isGenerating ? (
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-sm text-muted-foreground">이미지 생성 중...</p>
              </div>
            ) : currentImage ? (
              <div className="max-w-full max-h-full flex flex-col items-center">
                {currentImage.imageUrl ? (
                  <img
                    src={currentImage.imageUrl}
                    alt={currentImage.prompt}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                  />
                ) : currentImage.imageBase64 ? (
                  <img
                    src={`data:image/png;base64,${currentImage.imageBase64}`}
                    alt={currentImage.prompt}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
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
        ) : (
          // History View
          <div className="flex-1 p-4">
            {generatedImages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    생성 기록이 없습니다
                  </p>
                </div>
              </div>
            ) : historyView === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {generatedImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setCurrentImage(image)
                      setViewMode('current')
                    }}
                    className={cn(
                      "group relative aspect-square rounded-lg overflow-hidden",
                      "border transition-all duration-200",
                      "hover:border-primary hover:shadow-lg hover:scale-105",
                      currentImage?.id === image.id
                        ? "border-primary shadow-lg"
                        : "border-border"
                    )}
                  >
                    {image.imageBase64 ? (
                      <img
                        src={`data:image/png;base64,${image.imageBase64}`}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs truncate">
                        {formatDate(image.timestamp)}
                      </p>
                    </div>
                    
                    {currentImage?.id === image.id && (
                      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-full overflow-y-auto">
                {generatedImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => {
                      setCurrentImage(image)
                      setViewMode('current')
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors",
                      currentImage?.id === image.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0">
                        {image.imageBase64 ? (
                          <img
                            src={`data:image/png;base64,${image.imageBase64}`}
                            alt={image.prompt}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {image.prompt || '프롬프트 없음'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(image.timestamp)}
                        </p>
                        {image.tags.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {image.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs py-0">
                                {tag}
                              </Badge>
                            ))}
                            {image.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs py-0">
                                +{image.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm border-t">
            {error}
          </div>
        )}

        {/* Current Image Info */}
        {currentImage && viewMode === 'current' && (
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>프롬프트: {currentImage.prompt}</div>
              <div>생성 시간: {new Date(currentImage.timestamp).toLocaleString()}</div>
              {currentImage.tags.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
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

        {/* History Footer */}
        {viewMode === 'history' && generatedImages.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>총 {generatedImages.length}개 생성</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-auto p-1"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}