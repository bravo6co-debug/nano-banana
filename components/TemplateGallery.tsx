'use client'

import { useState } from 'react'
import { presetTemplates } from '@/lib/prompts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Sparkles, ArrowRight, Edit, Check } from 'lucide-react'

interface TemplateGalleryProps {
  onTemplateSelect: (template: typeof presetTemplates[0]) => void
  isGenerating: boolean
}

export function TemplateGallery({ onTemplateSelect, isGenerating }: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customizeMode, setCustomizeMode] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const handleTemplateClick = (template: typeof presetTemplates[0]) => {
    setSelectedTemplate(template.id)
    setCustomPrompt(template.prompt)
    onTemplateSelect(template)
  }

  const handleQuickGenerate = (template: typeof presetTemplates[0]) => {
    onTemplateSelect(template)
  }

  const handleCustomGenerate = () => {
    if (customPrompt && selectedTemplate) {
      const customTemplate = presetTemplates.find(t => t.id === selectedTemplate)
      if (customTemplate) {
        onTemplateSelect({ ...customTemplate, prompt: customPrompt })
      }
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold mb-2">인기 템플릿</h3>
        <p className="text-muted-foreground">
          검증된 템플릿으로 빠르게 시작하세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {presetTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id
          
          return (
            <div
              key={template.id}
              className={cn(
                "relative group rounded-xl border-2 overflow-hidden transition-all duration-200",
                "hover:shadow-lg hover:scale-105",
                isSelected ? "border-primary shadow-lg" : "border-border hover:border-primary/50"
              )}
            >
              {/* Template Card */}
              <div className="p-4 bg-card">
                {/* Icon and Selection Indicator */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{template.icon}</div>
                  {isSelected && (
                    <Badge className="bg-primary text-primary-foreground">
                      <Check className="w-3 h-3 mr-1" />
                      선택됨
                    </Badge>
                  )}
                </div>

                {/* Template Info */}
                <h4 className="font-semibold mb-1">{template.name}</h4>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => handleTemplateClick(template)}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    선택
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleQuickGenerate(template)}
                    title="바로 생성"
                  >
                    <Sparkles className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Hover Overlay with Prompt Preview */}
              <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-center pointer-events-none">
                <p className="text-white text-xs mb-2 font-medium">프롬프트 미리보기:</p>
                <p className="text-white/80 text-xs line-clamp-4">
                  {template.prompt}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Customization Panel */}
      {selectedTemplate && (
        <div className="mt-8 p-6 bg-muted/30 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Edit className="w-4 h-4" />
              선택된 템플릿 커스터마이징
            </h4>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCustomizeMode(!customizeMode)}
            >
              {customizeMode ? '접기' : '펼치기'}
            </Button>
          </div>

          {customizeMode && (
            <div className="space-y-4">
              <textarea
                value={customPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value)
                }}
                className="w-full p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="템플릿 프롬프트를 수정하세요..."
              />
              <Button 
                className="w-full"
                onClick={handleCustomGenerate}
                disabled={!customPrompt}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                커스텀 프롬프트로 생성
              </Button>
            </div>
          )}

          {!customizeMode && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                템플릿이 선택되었습니다
              </p>
              <Button 
                onClick={() => {
                  const template = presetTemplates.find(t => t.id === selectedTemplate)
                  if (template) onTemplateSelect(template)
                }}
                disabled={isGenerating}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {isGenerating ? '생성 중...' : '이 템플릿으로 생성'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}