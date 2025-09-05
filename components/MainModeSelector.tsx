'use client'

import { cn } from '@/lib/utils'
import { Sparkles, Edit3, Plus, Wand2 } from 'lucide-react'

export type MainMode = 'generate' | 'edit'

interface MainModeSelectorProps {
  selectedMode: MainMode | null
  onModeSelect: (mode: MainMode) => void
}

export function MainModeSelector({ selectedMode, onModeSelect }: MainModeSelectorProps) {
  const modes = [
    {
      id: 'generate' as MainMode,
      label: '이미지 생성',
      description: '텍스트로 새로운 이미지를 만들어요',
      icon: Plus,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950',
      features: [
        '템플릿으로 빠른 생성',
        '프롬프트로 상세 조정',
        'AI 기반 창작'
      ]
    },
    {
      id: 'edit' as MainMode,
      label: '이미지 편집',
      description: '기존 이미지를 수정하거나 합성해요',
      icon: Edit3,
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950',
      features: [
        '배경 제거/변경',
        '스타일 변환',
        '이미지 합성'
      ]
    }
  ]

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">무엇을 하시겠어요?</h1>
        </div>
        <p className="text-muted-foreground">
          AI로 새로운 이미지를 만들거나, 기존 이미지를 편집할 수 있어요
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isSelected = selectedMode === mode.id
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
              className={cn(
                "relative p-8 rounded-2xl border-2 transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-xl",
                "focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-2",
                isSelected ? [
                  "border-primary shadow-xl scale-[1.02]",
                  mode.bgColor
                ] : [
                  "border-border hover:border-primary/50",
                  "bg-card hover:bg-accent/5"
                ]
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-primary">선택됨</span>
                  </div>
                </div>
              )}
              
              <div className={cn(
                "w-16 h-16 rounded-xl mb-6 mx-auto",
                "bg-gradient-to-br flex items-center justify-center",
                "shadow-lg",
                mode.color
              )}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                {mode.label}
              </h3>
              <p className="text-muted-foreground mb-6">
                {mode.description}
              </p>
              
              <div className="space-y-2 text-left">
                {mode.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Wand2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </button>
          )
        })}
      </div>
      
      {selectedMode && (
        <div className="mt-8 p-6 rounded-xl bg-muted/50 text-center animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm font-medium">
            {selectedMode === 'generate' 
              ? '💡 템플릿을 선택하거나 직접 프롬프트를 입력해서 이미지를 생성할 수 있어요'
              : '✨ 다양한 편집 도구로 이미지를 변환하고 개선할 수 있어요'}
          </p>
        </div>
      )}
    </div>
  )
}