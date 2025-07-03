"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Database, FileText } from 'lucide-react'

interface LoadingStateProps {
  isVisible: boolean
}

export function LoadingState({ isVisible }: LoadingStateProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  
  console.log('LoadingState rendered with isVisible:', isVisible)

  const steps = [
    { icon: Database, text: "Connecting to university database..." },
    { icon: BookOpen, text: "Fetching student records..." },
    { icon: FileText, text: "Processing CGPA data..." },
  ]

  useEffect(() => {
    if (!isVisible) {
      setProgress(0)
      setCurrentStep(0)
      return
    }

    console.log('Starting loading animation')
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100
        }
        return prev + 2
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [isVisible, steps.length])

  if (!isVisible) return null

  const CurrentIcon = steps[currentStep].icon

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6 shadow-lg border-0 bg-academic-surface">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-academic-blue to-blue-600 rounded-full animate-pulse">
              <CurrentIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-academic-blue">
              Fetching Results...
            </h3>
            <p className="text-academic-slate animate-pulse">
              {steps[currentStep].text}
            </p>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="w-full h-3"
            />
            <p className="text-sm text-academic-slate">
              {progress}% Complete - Please wait...
            </p>
          </div>
          
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentStep 
                    ? 'bg-academic-blue scale-125' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}