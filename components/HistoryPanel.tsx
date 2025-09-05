'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Image as ImageIcon, Trash2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function HistoryPanel() {
  const { generatedImages, currentImage, setCurrentImage } = useAppStore()
  
  const handleSelectImage = (image: any) => {
    setCurrentImage(image)
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
    <div className="h-full flex flex-col bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          히스토리
        </h2>
        {generatedImages.length > 0 && (
          <Badge variant="secondary">{generatedImages.length}</Badge>
        )}
      </div>
      
      {generatedImages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              생성 기록이 없습니다
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {generatedImages.map((image) => (
            <button
              key={image.id}
              onClick={() => handleSelectImage(image)}
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
      
      {generatedImages.length > 0 && (
        <div className="mt-4 pt-4 border-t space-y-2">
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
  )
}