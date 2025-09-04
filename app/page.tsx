'use client'

import { useState } from 'react'
import { MainModeSelector, type MainMode } from '@/components/MainModeSelector'
import { EditOptionsSelector, type EditOption } from '@/components/EditOptionsSelector'
import { RouteManager } from '@/components/RouteManager'
import { TemplateGallery } from '@/components/TemplateGallery'
import { PromptBuilder } from '@/components/PromptBuilder'
import { UploadZone } from '@/components/UploadZone'
import { ResultsHistoryPanel } from '@/components/ResultsHistoryPanel'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { presetTemplates, type PresetTemplate } from '@/lib/prompts'
import { Sparkles, Shield, Info, ArrowLeft, RefreshCw } from 'lucide-react'

export default function HomePage() {
  // Main workflow states
  const [mainMode, setMainMode] = useState<MainMode | null>(null)
  const [editOption, setEditOption] = useState<EditOption | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<PresetTemplate | null>(null)
  const [showWatermarkInfo, setShowWatermarkInfo] = useState(false)

  // Store states
  const {
    selectedPrompts,
    customPrompt,
    uploadedImages,
    isGenerating,
    setIsGenerating,
    addGeneratedImage,
    setError,
    error,
    clearPrompts,
    setCustomPrompt,
    clearUploadedImages
  } = useAppStore()

  const combinedPrompt = [...selectedPrompts, customPrompt].filter(Boolean).join(', ')

  // Step navigation logic
  const getMaxSteps = () => {
    if (mainMode === 'generate') return 4 // mode -> template(optional) -> prompt -> generate
    if (mainMode === 'edit') return 6 // mode -> edit-type -> upload -> template(optional) -> prompt -> generate
    return 1
  }

  const getCurrentStepContent = () => {
    // Step 0: Main mode selection
    if (currentStep === 0) {
      return (
        <MainModeSelector 
          selectedMode={mainMode}
          onModeSelect={handleModeSelect}
        />
      )
    }

    // Generate Route
    if (mainMode === 'generate') {
      switch (currentStep) {
        case 1: // Template (optional)
          return (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">템플릿 선택 (선택사항)</h3>
                <p className="text-muted-foreground text-sm">
                  템플릿을 선택하거나 건너뛰고 직접 프롬프트를 입력할 수 있습니다
                </p>
              </div>
              <TemplateGallery
                onTemplateSelect={handleTemplateSelect}
                isGenerating={isGenerating}
              />
            </div>
          )
        case 2: // Prompt
          return (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">프롬프트 입력</h3>
                <p className="text-muted-foreground text-sm">
                  {selectedTemplate 
                    ? '템플릿을 기반으로 프롬프트를 수정하거나 추가할 수 있습니다'
                    : '원하는 이미지를 설명해주세요'}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PromptBuilder />
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-medium mb-4">현재 프롬프트</h3>
                  {selectedTemplate && (
                    <div className="mb-4 p-3 bg-primary/10 rounded">
                      <p className="text-sm font-medium mb-1">{selectedTemplate.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedTemplate.prompt}</p>
                    </div>
                  )}
                  {combinedPrompt && (
                    <div className="p-3 bg-card rounded border text-sm">
                      {combinedPrompt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        case 3: // Generate/Results
          return (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">생성 결과</h3>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  처음부터 다시 시작
                </Button>
              </div>
              <ResultsHistoryPanel />
            </div>
          )
        default:
          return null
      }
    }

    // Edit Route
    if (mainMode === 'edit') {
      switch (currentStep) {
        case 1: // Edit type selection
          return (
            <EditOptionsSelector
              selectedOption={editOption}
              onOptionSelect={setEditOption}
            />
          )
        case 2: // Upload images
          return (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">이미지 업로드</h3>
                <p className="text-muted-foreground text-sm">
                  편집할 이미지를 업로드해주세요
                  {editOption === 'merge' && ' (여러 장 가능)'}
                </p>
              </div>
              <UploadZone />
            </div>
          )
        case 3: // Template (optional)
          return (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">템플릿 선택 (선택사항)</h3>
                <p className="text-muted-foreground text-sm">
                  편집에 사용할 스타일 템플릿을 선택할 수 있습니다
                </p>
              </div>
              <TemplateGallery
                onTemplateSelect={handleTemplateSelect}
                isGenerating={isGenerating}
              />
            </div>
          )
        case 4: // Prompt
          return (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">편집 지시사항</h3>
                <p className="text-muted-foreground text-sm">
                  어떻게 편집할지 설명해주세요
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PromptBuilder />
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="font-medium mb-4">편집 설정</h3>
                  {editOption && (
                    <div className="mb-4 p-3 bg-primary/10 rounded">
                      <p className="text-sm font-medium">
                        {editOption.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </p>
                    </div>
                  )}
                  {uploadedImages.length > 0 && (
                    <div className="mb-4 p-3 bg-accent/50 rounded">
                      <p className="text-sm">{uploadedImages.length}개 이미지 업로드됨</p>
                    </div>
                  )}
                  {combinedPrompt && (
                    <div className="p-3 bg-card rounded border text-sm">
                      {combinedPrompt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        case 5: // Generate/Results
          return (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">편집 결과</h3>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  처음부터 다시 시작
                </Button>
              </div>
              <ResultsHistoryPanel />
            </div>
          )
        default:
          return null
      }
    }

    return null
  }

  // Handlers
  const handleModeSelect = (mode: MainMode) => {
    setMainMode(mode)
    setCurrentStep(1)
    // Reset states when switching modes
    setEditOption(null)
    setSelectedTemplate(null)
    clearPrompts()
  }

  const handleTemplateSelect = (template: typeof presetTemplates[0]) => {
    setSelectedTemplate(template)
    setCustomPrompt(template.prompt)
  }

  const handleReset = () => {
    // Reset all states to initial
    setMainMode(null)
    setEditOption(null)
    setCurrentStep(0)
    setSelectedTemplate(null)
    clearPrompts()
    setCustomPrompt('')
    clearUploadedImages()
    setError(null)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Reset main mode if going back to first step
      if (currentStep === 1) {
        setMainMode(null)
        setEditOption(null)
      }
    }
  }

  const handleNext = () => {
    const maxSteps = getMaxSteps()
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // This is the generate step
      handleGenerate()
    }
  }

  const handleSkip = () => {
    // Skip optional steps (templates)
    handleNext()
  }

  const canProceed = () => {
    // Step 0: Mode selection
    if (currentStep === 0) return mainMode !== null
    
    if (mainMode === 'generate') {
      switch (currentStep) {
        case 1: return true // Template is optional
        case 2: return combinedPrompt.length > 0 || selectedTemplate !== null
        case 3: return false // Results page
        default: return false
      }
    }
    
    if (mainMode === 'edit') {
      switch (currentStep) {
        case 1: return editOption !== null
        case 2: return uploadedImages.length > 0
        case 3: return true // Template is optional
        case 4: return combinedPrompt.length > 0 || selectedTemplate !== null
        case 5: return false // Results page
        default: return false
      }
    }
    
    return false
  }

  const handleGenerate = async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const promptToUse = selectedTemplate 
        ? selectedTemplate.prompt + (combinedPrompt ? ', ' + combinedPrompt : '')
        : combinedPrompt

      // Add edit-specific context to prompt
      let finalPrompt = promptToUse
      if (mainMode === 'edit' && editOption) {
        const editContext = {
          'remove-bg': 'remove background, transparent background',
          'style-transfer': 'apply style transfer',
          'object-replace': 'replace objects in image',
          'merge': 'merge multiple images seamlessly',
          'enhance': 'enhance image quality, upscale, sharpen',
          'resize': 'intelligently resize and extend image',
          'filter': 'apply artistic filter effects',
          'text-overlay': 'add text overlay'
        }
        finalPrompt = `${editContext[editOption]}, ${promptToUse}`
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          images: mainMode === 'edit' ? uploadedImages : [],
          mode: mainMode,
          editOption: editOption
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const errorMsg = data.error || '이미지 생성에 실패했습니다'
        if (errorMsg.includes('quota') || errorMsg.includes('429')) {
          throw new Error('API 할당량 초과: 잠시 후 다시 시도하거나 새 API 키를 사용하세요')
        }
        throw new Error(errorMsg)
      }
      
      addGeneratedImage({
        id: data.id,
        prompt: data.prompt,
        imageUrl: data.imageUrl || null,
        imageBase64: data.imageBase64 || null,
        timestamp: data.timestamp,
        tags: data.tags || []
      })
    } catch (error) {
      console.error('Generation error:', error)
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다')
    } finally {
      setIsGenerating(false)
    }
  }

  const isLastStep = currentStep === getMaxSteps() - 1
  const isOptionalStep = 
    (mainMode === 'generate' && currentStep === 1) || 
    (mainMode === 'edit' && currentStep === 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Nano Banana</h1>
              <span className="text-sm text-muted-foreground">
                AI 이미지 생성 & 편집
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWatermarkInfo(!showWatermarkInfo)}
              >
                <Shield className="w-4 h-4 mr-1" />
                SynthID
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Watermark Info Banner */}
      {showWatermarkInfo && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  SynthID 워터마크 적용
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  모든 생성된 이미지에는 Google의 SynthID 워터마크가 자동으로 삽입됩니다.
                  이는 AI 생성 콘텐츠임을 식별하기 위한 안전 장치입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="container mx-auto p-4 max-w-7xl">
        <div className="min-h-[calc(100vh-8rem)] py-8">
          {currentStep === 0 ? (
            // First step without RouteManager wrapper
            <div className="max-w-5xl mx-auto">
              {getCurrentStepContent()}
              {mainMode && (
                <div className="flex justify-center mt-8">
                  <Button onClick={handleNext} size="lg" className="min-w-[200px]">
                    시작하기
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Other steps with RouteManager
            <RouteManager
              mainMode={mainMode}
              editOption={editOption}
              currentStep={currentStep}
              onBack={handleBack}
              onNext={handleNext}
              onSkip={isOptionalStep ? handleSkip : undefined}
              canProceed={canProceed() || isLastStep}
            >
              {getCurrentStepContent()}
            </RouteManager>
          )}
        </div>
        
        {/* Global Error Display */}
        {error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg shadow-lg max-w-md">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </main>
      
      {/* Copyright Notice */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground">
        Powered by Gemini 2.5 Flash
      </div>
    </div>
  )
}