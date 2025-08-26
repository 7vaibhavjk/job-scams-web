import { useState } from 'react'
import { Link, Shield, AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Progress } from './ui/progress'

interface LinkAnalysis {
  url: string
  riskScore: number
  status: 'safe' | 'moderate' | 'high' | 'dangerous'
  issues: Array<{
    type: 'warning' | 'error' | 'info'
    message: string
  }>
  details: {
    domain: string
    isSecure: boolean
    domainAge?: string
    redirects: number
    jobBoardType?: string
  }
}

export function JobAdChecker() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<LinkAnalysis | null>(null)

  const mockAnalyze = async (inputUrl: string): Promise<LinkAnalysis> => {
    const domain = new URL(inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`).hostname.toLowerCase()
    
    // Mock analysis logic
    let riskScore = 0
    let status: LinkAnalysis['status'] = 'safe'
    const issues: LinkAnalysis['issues'] = []
    
    // Check for suspicious domains
    if (domain.includes('scam') || domain.includes('fake') || domain.includes('suspicious')) {
      riskScore = 85
      status = 'dangerous'
      issues.push({
        type: 'error',
        message: 'Domain appears to be suspicious or flagged as fraudulent'
      })
      issues.push({
        type: 'error',
        message: 'Multiple reports of fake job postings from this domain'
      })
    } else if (domain.includes('temp') || domain.includes('new') || domain.includes('quick')) {
      riskScore = 60
      status = 'high'
      issues.push({
        type: 'warning',
        message: 'Recently created domain - exercise caution'
      })
      issues.push({
        type: 'warning',
        message: 'Limited online presence or verification'
      })
    } else if (!domain.includes('seek') && !domain.includes('indeed') && !domain.includes('linkedin')) {
      riskScore = 30
      status = 'moderate'
      issues.push({
        type: 'info',
        message: 'Not a well-known job board - verify independently'
      })
    } else {
      riskScore = 5
      status = 'safe'
      issues.push({
        type: 'info',
        message: 'Appears to be from a legitimate job board'
      })
    }

    return {
      url: inputUrl,
      riskScore,
      status,
      issues,
      details: {
        domain,
        isSecure: inputUrl.startsWith('https'),
        domainAge: status === 'dangerous' ? '2 days' : '3 years',
        redirects: Math.floor(Math.random() * 3),
        jobBoardType: domain.includes('seek') || domain.includes('indeed') || domain.includes('linkedin') 
          ? 'Established Job Board' 
          : 'Unknown/Independent Site'
      }
    }
  }

  const handleAnalyze = async () => {
    if (!url.trim()) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const result = await mockAnalyze(url)
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200'
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'dangerous': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressColor = (score: number) => {
    if (score < 20) return 'bg-green-500'
    if (score < 40) return 'bg-blue-500'
    if (score < 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link className="h-5 w-5" />
          <span>Job Ad Link Checker</span>
        </CardTitle>
        <p className="text-gray-600">
          Analyze job posting URLs for potential risks and suspicious activity
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Paste job posting URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            className="flex-1"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={!url.trim() || isLoading}
          >
            {isLoading ? 'Analyzing...' : 'Check Link'}
          </Button>
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Analysis Complete</h3>
                  <Badge className={getStatusColor(analysis.status)}>
                    {analysis.status.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{analysis.riskScore}%</div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Risk Level</span>
                <span>{analysis.riskScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(analysis.riskScore)}`}
                  style={{ width: `${analysis.riskScore}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Link Details</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Domain:</strong> {analysis.details.domain}</div>
                  <div><strong>Security:</strong> {analysis.details.isSecure ? '✓ HTTPS' : '✗ Not Secure'}</div>
                  <div><strong>Domain Age:</strong> {analysis.details.domainAge}</div>
                  <div><strong>Redirects:</strong> {analysis.details.redirects}</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Site Type</h4>
                <div className="text-sm">
                  <Badge variant="outline">{analysis.details.jobBoardType}</Badge>
                </div>
                <div className="pt-2">
                  <a 
                    href={analysis.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center text-sm"
                  >
                    View Original Link
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Analysis Results</h4>
              {analysis.issues.map((issue, index) => (
                <Alert 
                  key={index}
                  className={
                    issue.type === 'error' ? 'border-red-200 bg-red-50' :
                    issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }
                >
                  {issue.type === 'error' ? <XCircle className="h-4 w-4" /> :
                   issue.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                   <CheckCircle className="h-4 w-4" />}
                  <AlertDescription>{issue.message}</AlertDescription>
                </Alert>
              ))}
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Remember:</strong> Even legitimate-looking links can lead to scams. Always verify job offers through official company channels and never provide personal information or payment upfront.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}