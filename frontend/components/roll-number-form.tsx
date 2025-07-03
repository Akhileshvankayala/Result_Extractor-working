"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Search } from 'lucide-react'

interface RollNumberFormProps {
  onSubmit: (startRoll: string, endRoll: string) => void
  isLoading: boolean
}

export function RollNumberForm({ onSubmit, isLoading }: RollNumberFormProps) {
  const [startRoll, setStartRoll] = useState('')
  const [endRoll, setEndRoll] = useState('')
  
  console.log('RollNumberForm rendered with isLoading:', isLoading)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with rolls:', { startRoll, endRoll })
    
    if (startRoll.trim() && endRoll.trim()) {
      onSubmit(startRoll.trim(), endRoll.trim())
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-academic-surface">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-academic-blue to-blue-600 rounded-full">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-academic-blue">
          Engineering Result Extractor
        </CardTitle>
        <CardDescription className="text-academic-slate text-base mt-2">
          Enter a roll number range to fetch and generate CGPA reports for your class or section.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startRoll" className="text-sm font-medium text-gray-700">
                Starting Roll Number
              </Label>
              <Input
                id="startRoll"
                type="text"
                placeholder="e.g., 24EG105G01"
                value={startRoll}
                onChange={(e) => setStartRoll(e.target.value)}
                disabled={isLoading}
                className="h-11 border-2 focus:border-academic-blue transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endRoll" className="text-sm font-medium text-gray-700">
                Ending Roll Number
              </Label>
              <Input
                id="endRoll"
                type="text"
                placeholder="e.g., 24EG105G66"
                value={endRoll}
                onChange={(e) => setEndRoll(e.target.value)}
                disabled={isLoading}
                className="h-11 border-2 focus:border-academic-blue transition-colors"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={!startRoll.trim() || !endRoll.trim() || isLoading}
            className="w-full h-12 bg-academic-blue hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Fetch Results
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}