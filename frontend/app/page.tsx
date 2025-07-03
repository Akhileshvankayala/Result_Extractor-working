"use client"

import { useState } from 'react'
import { RollNumberForm } from '@/components/roll-number-form'
import { LoadingState } from '@/components/loading-state'
import { ResultsTable, StudentResult } from '@/components/results-table'
import { DownloadButtons } from '@/components/download-buttons'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<StudentResult[]>([])
  const [showResults, setShowResults] = useState(false)

  console.log('Home component rendered. State:', { isLoading, resultsCount: results.length, showResults })

  const handleFormSubmit = async (startRoll: string, endRoll: string) => {
    console.log('Form submitted with:', { startRoll, endRoll })
    setIsLoading(true)
    setShowResults(false)
    setResults([])
    try {
      // Call backend API
      const response = await fetch('http://localhost:5000/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_roll: startRoll, end_roll: endRoll })
      })
      if (!response.ok) throw new Error('Failed to fetch results')
      const data = await response.json()
      // Map backend results to StudentResult[]
      const mappedResults: StudentResult[] = data.results.map((r: any) => {
        let status: StudentResult['status'] = 'success'
        if (r.status === 'Backlog') status = 'backlog'
        else if (r.status === 'Student does not exist.') status = 'not_found'
        else if (r.status === 'Error in extracting information.') status = 'error'
        return {
          rollNumber: r.roll_number,
          cgpa: r.cgpa,
          status
        }
      })
      setResults(mappedResults)
      setShowResults(true)
    } catch (error) {
      console.error('Error fetching results:', error)
      setResults([])
      setShowResults(false)
      alert('Failed to fetch results. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-academic-background py-8 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <RollNumberForm 
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
        <LoadingState isVisible={isLoading} />
        <ResultsTable 
          results={results}
          isVisible={showResults && !isLoading}
        />
        <DownloadButtons 
          results={results}
          isVisible={showResults && !isLoading}
        />
      </div>
    </div>
  )
}
