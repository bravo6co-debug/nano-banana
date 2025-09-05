'use client'

import { useState } from 'react'
import { presetTemplates } from '@/lib/prompts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Sparkles, Check } from 'lucide-react'

interface TemplateGalleryProps {
  onTemplateSelect: (template: typeof presetTemplates[0]) => void
  isGenerating: boolean
}

export function TemplateGallery({ onTemplateSelect, isGenerating }: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleTemplateClick = (template: typeof presetTemplates[0]) => {
    setSelectedTemplate(template.id)
    onTemplateSelect(template)
  }

  const handleQuickGenerate = (template: typeof presetTemplates[0]) => {
    onTemplateSelect(template)
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
            </div>
          )
        })}
      </div>
    </div>
  )
}