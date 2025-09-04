'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { type CreationMode } from '@/components/CreationModeSelector'

interface WorkflowContainerProps {
  currentMode: CreationMode
  step: number
  maxSteps: number
  onBack: () => void
  onNext?: () => void
  onModeChange: (mode: CreationMode) => void
  children: ReactNode
  className?: string
  showSteps?: boolean
  title?: string
  subtitle?: string
}

const modeLabels = {
  template: '템플릿',
  prompt: '프롬프트 빌더',
  upload: '이미지 편집'
}

const stepLabels = [
  '생성 방식 선택',
  '세부 설정',
  '결과 확인'
]

export function WorkflowContainer({
  currentMode,
  step,
  maxSteps,
  onBack,
  onNext,
  onModeChange,
  children,
  className,
  showSteps = true,
  title,
  subtitle
}: WorkflowContainerProps) {
  const canGoBack = step > 0
  const canGoNext = onNext && step < maxSteps - 1

  return (
    <div className={cn("w-full", className)}>
      {/* Progress indicator */}
      {showSteps && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            {Array.from({ length: maxSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    "transition-colors duration-200",
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </div>
                {i < maxSteps - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-1 transition-colors duration-200",
                      i < step ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {stepLabels[step] || `단계 ${step + 1}`}
            </div>
            {step > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                현재 모드: {modeLabels[currentMode]}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode selector breadcrumb */}
      {step > 0 && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onModeChange('template')}
              className={cn(
                "px-2 py-1 rounded transition-colors",
                currentMode === 'template'
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-background"
              )}
            >
              템플릿
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => onModeChange('prompt')}
              className={cn(
                "px-2 py-1 rounded transition-colors",
                currentMode === 'prompt'
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-background"
              )}
            >
              프롬프트
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={() => onModeChange('upload')}
              className={cn(
                "px-2 py-1 rounded transition-colors",
                currentMode === 'upload'
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-background"
              )}
            >
              이미지 편집
            </button>
          </div>
        </div>
      )}

      {/* Content header */}
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={!canGoBack}
          className={cn(!canGoBack && "invisible")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {step + 1} / {maxSteps}
        </div>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className={cn(!canGoNext && "invisible")}
        >
          다음
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}