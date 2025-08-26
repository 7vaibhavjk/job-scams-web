import { useState } from 'react'
import { AlertTriangle, Send, Eye, Shield, Calendar, MapPin } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Separator } from './ui/separator'

interface ScamReport {
  id: string
  type: 'fake-job' | 'payment-scam' | 'identity-theft' | 'pyramid-scheme' | 'other'
  companyName: string
  description: string
  dateReported: string
  location: string
  status: 'new' | 'investigating' | 'verified' | 'resolved'
  reportCount: number
}

const mockReports: ScamReport[] = [
  {
    id: '1',
    type: 'fake-job',
    companyName: 'Quick Hire Solutions',
    description: 'Fake job posting demanding upfront payment for "training materials"',
    dateReported: '2025-01-15',
    location: 'Sydney, NSW',
    status: 'verified',
    reportCount: 12
  },
  {
    id: '2',
    type: 'identity-theft',
    companyName: 'Remote Work Corp',
    description: 'Requesting passport scans and bank details before interview',
    dateReported: '2025-01-14',
    location: 'Melbourne, VIC',
    status: 'investigating',
    reportCount: 8
  },
  {
    id: '3',
    type: 'payment-scam',
    companyName: 'Home Business Hub',
    description: 'MLM scheme disguised as data entry job opportunity',
    dateReported: '2025-01-13',
    location: 'Brisbane, QLD',
    status: 'new',
    reportCount: 5
  }
]

export function ReportingPortal() {
  const [reportType, setReportType] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [description, setDescription] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitReport = async () => {
    if (!reportType || !companyName || !description) return
    
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    
    // Reset form
    setTimeout(() => {
      setReportType('')
      setCompanyName('')
      setJobTitle('')
      setDescription('')
      setContactInfo('')
      setSubmitted(false)
    }, 3000)
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      investigating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      verified: 'bg-red-100 text-red-800 border-red-200',
      resolved: 'bg-green-100 text-green-800 border-green-200'
    }
    return <Badge className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Badge>
  }

  const getTypeBadge = (type: string) => {
    const labels = {
      'fake-job': 'Fake Job',
      'payment-scam': 'Payment Scam',
      'identity-theft': 'Identity Theft',
      'pyramid-scheme': 'Pyramid Scheme',
      'other': 'Other'
    }
    return <Badge variant="outline">{labels[type as keyof typeof labels]}</Badge>
  }

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="report">Report a Scam</TabsTrigger>
          <TabsTrigger value="view">View Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Report Job Scam</span>
              </CardTitle>
              <p className="text-gray-600">
                Help protect others by reporting suspicious job postings or scam activities. 
                Your report is anonymous and confidential.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitted ? (
                <Alert className="border-green-200 bg-green-50">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Thank you for your report!</strong> Your submission has been received and will be reviewed by our team. 
                    Report ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Scam Type</label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select scam type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fake-job">Fake Job Posting</SelectItem>
                          <SelectItem value="payment-scam">Payment/Fee Scam</SelectItem>
                          <SelectItem value="identity-theft">Identity Theft</SelectItem>
                          <SelectItem value="pyramid-scheme">Pyramid/MLM Scheme</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company/Employer Name</label>
                      <Input
                        placeholder="Enter company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Job Title (Optional)</label>
                    <Input
                      placeholder="Enter job title if available"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe what happened, including any red flags, suspicious requests, or fraudulent activities..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Information (Optional)</label>
                    <Input
                      placeholder="Your email if you want updates on this report"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Providing contact info is optional. We may reach out for additional details.
                    </p>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy Notice:</strong> Your report is confidential. We do not share personal information 
                      and only use reports to identify patterns and protect other job seekers.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitReport}
                      disabled={!reportType || !companyName || !description || isSubmitting}
                      className="flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Recent Scam Reports</span>
              </CardTitle>
              <p className="text-gray-600">
                View recent job scam reports from the community to stay informed about current threats.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{report.companyName}</h3>
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(report.type)}
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{report.reportCount} reports</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700">{report.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(report.dateReported).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{report.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Disclaimer:</strong> Reports are user-submitted and under investigation. 
                  Always verify information independently and contact authorities if you believe you've encountered a scam.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}