'use client'

import { useState } from 'react'
import { promptCategories, presetTemplates } from '@/lib/prompts'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { X, Sparkles, Wand2 } from 'lucide-react'

interface PromptBuilderProps {
  compact?: boolean
  showHeader?: boolean
}

export function PromptBuilder({ compact = false, showHeader = true }: PromptBuilderProps) {
  const [activeCategory, setActiveCategory] = useState('style')
  const [showPresets, setShowPresets] = useState(false)
  
  const {
    selectedPrompts,
    customPrompt,
    addPrompt,
    removePrompt,
    clearPrompts,
    setCustomPrompt,
    isGenerating
  } = useAppStore()
  
  const currentCategory = promptCategories.find(cat => cat.id === activeCategory)
  
  const handlePromptToggle = (value: string) => {
    if (selectedPrompts.includes(value)) {
      removePrompt(value)
    } else {
      addPrompt(value)
    }
  }
  
  const handlePresetSelect = (prompt: string) => {
    clearPrompts()
    setCustomPrompt(prompt)
    setShowPresets(false)
  }
  
  const combinedPrompt = [...selectedPrompts, customPrompt].filter(Boolean).join(', ')
  
  return (
    <div className={cn(
      "flex flex-col bg-card rounded-lg border-2 border-primary p-4 shadow-lg",
      compact ? "h-auto" : "h-full"
    )}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            프롬프트 빌더
          </h2>
          {!compact && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPresets(!showPresets)}
            >
              <Wand2 className="w-4 h-4 mr-1" />
              템플릿
            </Button>
          )}
        </div>
      )}
      
      {showPresets && !compact ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {presetTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => handlePresetSelect(template.prompt)}
                className="text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                disabled={isGenerating}
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {template.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto">
            {promptCategories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="flex-shrink-0"
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </Button>
            ))}
          </div>
          
          {/* Prompt Buttons */}
          <div className={cn(
            "mb-4",
            compact ? "max-h-60 overflow-y-auto" : "flex-1 overflow-y-auto"
          )}>
            <div className={cn(
              "grid gap-2",
              compact ? "grid-cols-3" : "grid-cols-2"
            )}>
              {currentCategory?.buttons.map(button => (
                <Button
                  key={button.id}
                  variant={selectedPrompts.includes(button.value) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePromptToggle(button.value)}
                  disabled={isGenerating}
                  className="justify-start"
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Custom Prompt Input */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="프롬프트를 입력하세요... (예: 화려한 색상의 풍경화)"
            className="w-full p-3 text-sm border-2 border-blue-400 rounded-lg resize-none focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white dark:bg-gray-900 placeholder:text-blue-400/60"
            rows={3}
            disabled={isGenerating}
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-500 text-white text-xs">
              필수 입력
            </Badge>
          </div>
        </div>
        
        {/* Selected Prompts */}
        {selectedPrompts.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedPrompts.map(prompt => (
              <Badge
                key={prompt}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removePrompt(prompt)}
              >
                {prompt}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
        
        {/* Combined Prompt Preview */}
        {combinedPrompt && !compact && (
          <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
            {combinedPrompt}
          </div>
        )}
      </div>
    </div>
  )
}