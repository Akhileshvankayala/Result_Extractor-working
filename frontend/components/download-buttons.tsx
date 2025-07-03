"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { StudentResult } from './results-table'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DownloadButtonsProps {
  results: StudentResult[]
  isVisible: boolean
}

export function DownloadButtons({ results, isVisible }: DownloadButtonsProps) {
  if (!isVisible || results.length === 0) return null

  // Prepare summary for backend
  const getSummary = () => ({
    active: results.filter(r => r.status === 'success').length,
    backlog: results.filter(r => r.status === 'backlog').length,
    not_found: results.filter(r => r.status === 'not_found').length,
    error: results.filter(r => r.status === 'error').length
  })

  const downloadExcel = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/download/excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: results.map(r => ({
          roll_number: r.rollNumber,
          cgpa: r.cgpa,
          status: r.status === 'success' ? 'Active' :
                 r.status === 'backlog' ? 'Backlog' :
                 r.status === 'not_found' ? 'Student does not exist.' :
                 r.status === 'error' ? 'Error in extracting information.' : 'Unknown'
        })), summary: getSummary() })
      })
      if (!response.ok) throw new Error('Failed to download Excel')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `engineering_results_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to download Excel file.')
    }
  }

  const downloadPDF = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/download/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: results.map(r => ({
          roll_number: r.rollNumber,
          cgpa: r.cgpa,
          status: r.status === 'success' ? 'Active' :
                 r.status === 'backlog' ? 'Backlog' :
                 r.status === 'not_found' ? 'Student does not exist.' :
                 r.status === 'error' ? 'Error in extracting information.' : 'Unknown'
        })), summary: getSummary() })
      })
      if (!response.ok) throw new Error('Failed to download PDF')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `engineering_results_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to download PDF file.')
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto mt-6 shadow-lg border-0 bg-academic-surface">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Download className="h-5 w-5 text-academic-blue" />
            <span className="font-medium text-academic-blue">Download Reports:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={downloadExcel}
              className="bg-academic-success hover:bg-emerald-600 text-white font-medium px-6 py-2 transition-all duration-200 transform hover:scale-105"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
            <Button 
              onClick={downloadPDF}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 transition-all duration-200 transform hover:scale-105"
            >
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-academic-slate">
          Files will be saved to your default download location
        </div>
      </CardContent>
    </Card>
  )
}