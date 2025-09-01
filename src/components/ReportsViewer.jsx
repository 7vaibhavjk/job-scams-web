import { AlertTriangle, Eye, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx'
import { Badge } from './ui/badge.jsx'
import { Alert, AlertDescription } from './ui/alert.jsx'
import { Separator } from './ui/separator.jsx'

const mockReports = [
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

export function ReportsViewer() {
  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-200',
      investigating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      verified: 'bg-red-100 text-red-800 border-red-200',
      resolved: 'bg-green-100 text-green-800 border-green-200'
    }
    return <Badge className={colors[status]}>{status.toUpperCase()}</Badge>
  }

  const getTypeBadge = (type) => {
    const labels = {
      'fake-job': 'Fake Job',
      'payment-scam': 'Payment Scam',
      'identity-theft': 'Identity Theft',
      'pyramid-scheme': 'Pyramid Scheme',
      'other': 'Other'
    }
    return <Badge variant="outline">{labels[type]}</Badge>
  }

  return (
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
  )
}
