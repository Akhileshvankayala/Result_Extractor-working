"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trophy, User, AlertTriangle, X } from 'lucide-react'

export interface StudentResult {
  rollNumber: string
  cgpa: string | number
  status: 'success' | 'backlog' | 'not_found' | 'error'
}

interface ResultsTableProps {
  results: StudentResult[]
  isVisible: boolean
}

export function ResultsTable({ results, isVisible }: ResultsTableProps) {
  console.log('ResultsTable rendered with results:', results, 'isVisible:', isVisible)

  if (!isVisible || results.length === 0) return null

  const getStatusBadge = (status: StudentResult['status'], cgpa: string | number) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-academic-success text-white">
            <Trophy className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case 'backlog':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Backlog
          </Badge>
        )
      case 'not_found':
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-600">
            <User className="h-3 w-3 mr-1" />
            Not Found
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return null
    }
  }

  const formatCGPA = (cgpa: string | number, status: StudentResult['status']) => {
    if (status === 'not_found') return 'Student does not exist'
    if (status === 'error') return 'Error in extracting information'
    if (status === 'backlog' || cgpa === '--' || cgpa === '-') return '--'
    
    return typeof cgpa === 'number' ? cgpa.toFixed(2) : cgpa
  }

  // Sort results: successful students by CGPA (highest first), then others
  const sortedResults = [...results].sort((a, b) => {
    if (a.status === 'success' && b.status === 'success') {
      const cgpaA = typeof a.cgpa === 'number' ? a.cgpa : parseFloat(a.cgpa.toString())
      const cgpaB = typeof b.cgpa === 'number' ? b.cgpa : parseFloat(b.cgpa.toString())
      return cgpaB - cgpaA // Descending order
    }
    
    if (a.status === 'success') return -1
    if (b.status === 'success') return 1
    
    return 0 // Keep original order for non-success results
  })

  return (
    <Card className="w-full max-w-5xl mx-auto mt-6 shadow-lg border-0 bg-academic-surface">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-academic-blue flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Results Summary ({results.length} students)
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-academic-blue">Roll Number</TableHead>
                <TableHead className="font-semibold text-academic-blue">CGPA</TableHead>
                <TableHead className="font-semibold text-academic-blue">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, index) => (
                <TableRow 
                  key={result.rollNumber}
                  className={`transition-colors hover:bg-gray-50 ${
                    index < 3 && result.status === 'success' ? 'bg-yellow-50' : ''
                  }`}
                >
                  <TableCell className="font-mono text-sm font-medium">
                    {result.rollNumber}
                    {index < 3 && result.status === 'success' && (
                      <Trophy className="inline h-4 w-4 ml-2 text-yellow-600" />
                    )}
                  </TableCell>
                  <TableCell className={`font-semibold ${
                    result.status === 'success' ? 'text-academic-success' : 'text-academic-slate'
                  }`}>
                    {formatCGPA(result.cgpa, result.status)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(result.status, result.cgpa)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-academic-success">
              {results.filter(r => r.status === 'success').length}
            </div>
            <div className="text-sm text-academic-slate">Active Students</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {results.filter(r => r.status === 'backlog').length}
            </div>
            <div className="text-sm text-academic-slate">With Backlogs</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {results.filter(r => r.status === 'not_found').length}
            </div>
            <div className="text-sm text-academic-slate">Not Found</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {results.filter(r => r.status === 'error').length}
            </div>
            <div className="text-sm text-academic-slate">Errors</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}