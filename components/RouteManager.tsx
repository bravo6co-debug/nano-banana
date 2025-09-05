'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, SkipForward, Sparkles } from 'lucide-react'
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
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep
          const isCompleted = idx < currentStep
          const isOptional = step.optional
          
          return (
            <Button
              key={step.id}
              variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "relative transition-all duration-200",
                isActive && "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
                isCompleted && "bg-green-100 hover:bg-green-200 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
                !isActive && !isCompleted && "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              disabled
            >
              <span className="font-semibold mr-1.5">{idx + 1}.</span>
              <span>{step.label}</span>
              {isOptional && !isActive && !isCompleted && (
                <span className="ml-1 text-xs opacity-60">(선택)</span>
              )}
            </Button>
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
          className={cn(
            currentStep === 0 && "invisible",
            "hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600"
          )}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          이전 단계
        </Button>

        <div className="flex items-center gap-4">
          {isOptionalStep && onSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              건너뛰기
            </Button>
          )}
          
          <Button
            onClick={onNext}
            disabled={!canProceed && !isOptionalStep}
            className={cn(
              currentStep === steps.length - 1
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                : "bg-primary hover:bg-primary/90"
            )}
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                생성하기
              </>
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