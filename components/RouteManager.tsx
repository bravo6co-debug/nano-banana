'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type MainMode } from '@/components/MainModeSelector'
import { type EditOption } from '@/components/EditOptionsSelector'

export type WorkflowStep = {
  id: string
  label: string
  optional?: boolean
}

interface RouteManagerProps {
  mainMode: MainMode | null
  editOption?: EditOption | null
  currentStep: number
  onBack: () => void
  onNext: () => void
  onSkip?: () => void
  canProceed: boolean
  children: ReactNode
}

const generateSteps: WorkflowStep[] = [
  { id: 'mode', label: '생성/편집 선택' },
  { id: 'template', label: '템플릿 선택', optional: true },
  { id: 'prompt', label: '프롬프트 입력' },
  { id: 'generate', label: '생성' }
]

const editSteps: WorkflowStep[] = [
  { id: 'mode', label: '생성/편집 선택' },
  { id: 'edit-type', label: '편집 유형' },
  { id: 'upload', label: '이미지 업로드' },
  { id: 'template', label: '템플릿 선택', optional: true },
  { id: 'prompt', label: '프롬프트 입력' },
  { id: 'generate', label: '생성' }
]

export function RouteManager({
  mainMode,
  editOption,
  currentStep,
  onBack,
  onNext,
  onSkip,
  canProceed,
  children
}: RouteManagerProps) {
  const steps = mainMode === 'edit' ? editSteps : generateSteps
  const currentStepData = steps[currentStep]
  const isOptionalStep = currentStepData?.optional

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep
          const isOptional = step.optional
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    "transition-all duration-200 relative",
                    isActive && "ring-4 ring-primary/20",
                    isCompleted || isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isOptional && !isActive && !isCompleted && (
                    <span className="absolute -top-1 -right-1 text-xs">선택</span>
                  )}
                  {idx + 1}
                </div>
                <span className={cn(
                  "text-xs mt-2 max-w-[80px] text-center",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-2 mt-[-16px]",
                    "transition-colors duration-200",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Progress Header */}
      <div className="mb-8">
        {renderStepIndicator()}
        
        {mainMode && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
              <span className="font-medium">
                {mainMode === 'generate' ? '🎨 이미지 생성' : '✏️ 이미지 편집'}
              </span>
              {editOption && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {editOption.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-[400px] mb-8">
        {children}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 0}
          className={cn(currentStep === 0 && "invisible")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          이전 단계
        </Button>

        <div className="flex items-center gap-4">
          {isOptionalStep && onSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              건너뛰기
            </Button>
          )}
          
          <Button
            onClick={onNext}
            disabled={!canProceed && !isOptionalStep}
          >
            {currentStep === steps.length - 1 ? (
              '생성하기'
            ) : (
              <>
                다음 단계
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}