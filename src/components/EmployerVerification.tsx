import { useState } from 'react'
import { Search, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'

interface VerificationResult {
  companyName: string
  status: 'verified' | 'suspicious' | 'unknown' | 'dangerous'
  abn?: string
  website?: string
  address?: string
  warnings: string[]
  tips: string[]
}

export function EmployerVerification() {
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const mockVerify = async (name: string): Promise<VerificationResult> => {
    // Mock verification logic - in real app this would call an API
    const lowercaseName = name.toLowerCase()
    
    if (lowercaseName.includes('scam') || lowercaseName.includes('fake')) {
      return {
        companyName: name,
        status: 'dangerous',
        warnings: [
          'This company has been reported for fraudulent job postings',
          'Multiple users have reported unpaid work promises',
          'Company requests upfront payments from job seekers'
        ],
        tips: [
          'Do not provide personal documents or banking details',
          'Never pay money upfront for job opportunities',
          'Report this company to authorities'
        ]
      }
    } else if (lowercaseName.includes('suspicious') || lowercaseName.includes('unknown')) {
      return {
        companyName: name,
        status: 'suspicious',
        warnings: [
          'Limited online presence or recently created website',
          'Job offers seem too good to be true',
          'Vague company information provided'
        ],
        tips: [
          'Research the company independently',
          'Ask for detailed job descriptions and contracts',
          'Verify the company address and contact information'
        ]
      }
    } else {
      return {
        companyName: name,
        status: 'verified',
        abn: '12 345 678 901',
        website: 'www.example-company.com.au',
        address: '123 Business St, Sydney NSW 2000',
        warnings: [],
        tips: [
          'Company appears legitimate with proper registration',
          'Still verify job offers through official channels',
          'Trust your instincts if something feels wrong'
        ]
      }
    }
  }

  const handleVerify = async () => {
    if (!companyName.trim()) return
    
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      const result = await mockVerify(companyName)
      setResult(result)
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✓ Verified</Badge>
      case 'suspicious':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠ Suspicious</Badge>
      case 'dangerous':
        return <Badge className="bg-red-100 text-red-800 border-red-200">✗ Dangerous</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">? Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'suspicious':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'dangerous':
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Employer Verification Tool</span>
        </CardTitle>
        <p className="text-gray-600">
          Check if an employer or company is legitimate before applying for jobs
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter company name..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            className="flex-1"
          />
          <Button 
            onClick={handleVerify}
            disabled={!companyName.trim() || isLoading}
          >
            {isLoading ? 'Checking...' : 'Verify'}
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <div>
                  <h3 className="font-semibold">{result.companyName}</h3>
                  {getStatusBadge(result.status)}
                </div>
              </div>
            </div>

            {result.abn && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>ABN:</strong> {result.abn}
                </div>
                <div>
                  <strong>Website:</strong> 
                  <a href={`https://${result.website}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline inline-flex items-center">
                    {result.website}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
                <div className="md:col-span-2">
                  <strong>Address:</strong> {result.address}
                </div>
              </div>
            )}

            {result.warnings.length > 0 && (
              <Alert className={result.status === 'dangerous' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warnings:</strong>
                  <ul className="mt-2 space-y-1">
                    {result.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Safety Tips:</strong>
                <ul className="mt-2 space-y-1">
                  {result.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}