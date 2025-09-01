import { useState } from 'react'
import { AlertTriangle, Send, Shield } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Alert, AlertDescription } from '../components/ui/alert.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'

export function SubmitReportPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Submit Scam Report</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help protect others by reporting suspicious job postings or scam activities. 
            Your report is anonymous and confidential.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
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
        </div>
      </div>
    </div>
  )
}
