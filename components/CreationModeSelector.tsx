'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, Palette, Upload, Wand2, Image, Layers } from 'lucide-react'

export type CreationMode = 'template' | 'prompt' | 'upload'

interface CreationModeSelectorProps {
  selectedMode: CreationMode
  onModeChange: (mode: CreationMode) => void
}

export function CreationModeSelector({ selectedMode, onModeChange }: CreationModeSelectorProps) {
  const modes = [
    {
      id: 'template' as CreationMode,
      label: '템플릿으로 시작',
      description: '인기 템플릿으로 빠르게 생성',
      icon: Wand2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950'
    },
    {
      id: 'prompt' as CreationMode,
      label: '프롬프트 빌더',
      description: '버튼과 텍스트로 상세 조정',
      icon: Palette,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950'
    },
    {
      id: 'upload' as CreationMode,
      label: '이미지 편집/합성',
      description: '기존 이미지 수정 또는 결합',
      icon: Layers,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
    }
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">생성 방식 선택</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isSelected = selectedMode === mode.id
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                "relative p-6 rounded-xl border-2 transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected ? [
                  "border-primary shadow-lg",
                  mode.bgColor
                ] : [
                  "border-border hover:border-primary/50",
                  "bg-card"
                ]
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-lg mb-4 mx-auto",
                "bg-gradient-to-br flex items-center justify-center",
                mode.color
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-lg mb-1">
                {mode.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {mode.description}
              </p>
              
              {isSelected && (
                <div className="mt-3 flex items-center justify-center gap-1">
                  <span className="text-xs text-primary font-medium">선택됨</span>
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          {selectedMode === 'template' && '🎯 프로필 사진, SNS 썸네일 등 검증된 템플릿으로 시작하세요'}
          {selectedMode === 'prompt' && '🎨 카테고리별 버튼으로 원하는 스타일을 조합하세요'}
          {selectedMode === 'upload' && '🖼️ 이미지를 업로드하여 편집하거나 여러 이미지를 합성하세요'}
        </p>
      </div>
    </div>
  )
}