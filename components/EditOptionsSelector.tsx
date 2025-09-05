'use client'

import { cn } from '@/lib/utils'
import { 
  Eraser, 
  Palette, 
  Replace, 
  Layers, 
  Sparkles,
  Maximize,
  Wand2,
  Image,
  Check
} from 'lucide-react'

export type EditOption = 
  | 'remove-bg' 
  | 'style-transfer' 
  | 'object-replace' 
  | 'merge' 
  | 'enhance'
  | 'resize'
  | 'filter'
  | 'text-overlay'

interface EditOptionsSelectorProps {
  selectedOption: EditOption | null
  onOptionSelect: (option: EditOption) => void
}

export function EditOptionsSelector({ selectedOption, onOptionSelect }: EditOptionsSelectorProps) {
  const options = [
    {
      id: 'remove-bg' as EditOption,
      label: '배경 제거',
      description: '이미지의 배경을 제거하거나 변경',
      icon: Eraser,
      color: 'from-red-500 to-pink-500',
      example: '인물 사진의 배경을 투명하게'
    },
    {
      id: 'style-transfer' as EditOption,
      label: '스타일 변환',
      description: '이미지를 다른 예술 스타일로 변환',
      icon: Palette,
      color: 'from-purple-500 to-indigo-500',
      example: '사진을 유화나 애니메 스타일로'
    },
    {
      id: 'object-replace' as EditOption,
      label: '객체 교체',
      description: '이미지의 특정 객체를 다른 것으로 교체',
      icon: Replace,
      color: 'from-blue-500 to-cyan-500',
      example: '배경의 하늘을 석양으로 변경'
    },
    {
      id: 'merge' as EditOption,
      label: '이미지 합성',
      description: '여러 이미지를 하나로 합성',
      icon: Layers,
      color: 'from-green-500 to-emerald-500',
      example: '두 장의 사진을 자연스럽게 결합'
    },
    {
      id: 'enhance' as EditOption,
      label: '품질 개선',
      description: '이미지 해상도와 품질 향상',
      icon: Sparkles,
      color: 'from-yellow-500 to-orange-500',
      example: '흐릿한 사진을 선명하게'
    },
    {
      id: 'resize' as EditOption,
      label: '크기 조정',
      description: 'AI로 이미지 크기를 지능적으로 조정',
      icon: Maximize,
      color: 'from-teal-500 to-green-500',
      example: '세로 사진을 가로로 확장'
    },
    {
      id: 'filter' as EditOption,
      label: '필터 적용',
      description: '다양한 예술적 필터 효과 적용',
      icon: Wand2,
      color: 'from-indigo-500 to-purple-500',
      example: '빈티지, 흑백, 네온 효과'
    },
    {
      id: 'text-overlay' as EditOption,
      label: '텍스트 추가',
      description: '이미지에 텍스트나 워터마크 추가',
      icon: Image,
      color: 'from-gray-500 to-slate-500',
      example: '로고나 캡션 추가'
    }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">어떤 편집을 하시겠어요?</h2>
        <p className="text-muted-foreground">
          원하는 편집 기능을 선택하세요
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = selectedOption === option.id
          
          return (
            <button
              key={option.id}
              onClick={() => onOptionSelect(option.id)}
              className={cn(
                "relative p-5 rounded-xl border-2 transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-lg group",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected ? [
                  "border-primary !border-4 shadow-2xl scale-[1.03] ring-4 ring-primary/30",
                  "bg-gradient-to-br from-primary/20 to-primary/30"
                ] : [
                  "border-gray-200 dark:border-gray-700 hover:border-primary/50",
                  "bg-white dark:bg-gray-900 hover:bg-accent/5"
                ]
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                  <div className="bg-primary text-white p-1.5 rounded-full shadow-lg animate-bounce">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-lg mb-3 mx-auto",
                "bg-gradient-to-br flex items-center justify-center",
                "group-hover:scale-110 transition-transform",
                option.color
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-sm mb-1">
                {option.label}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {option.description}
              </p>
              <p className="text-xs text-primary/60 italic">
                예: {option.example}
              </p>
            </button>
          )
        })}
      </div>
      
      {selectedOption && (
        <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm">
            <span className="font-medium">
              {options.find(o => o.id === selectedOption)?.label}
            </span>
            {' 기능을 선택하셨습니다. 다음 단계에서 이미지를 업로드해주세요.'}
          </p>
        </div>
      )}
    </div>
  )
}