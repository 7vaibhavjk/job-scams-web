import { Shield, Users, TrendingUp, ExternalLink, Phone, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'

export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">About Job Scams in Australia</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about the growing threat of employment scams and how to protect yourself
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  <span>The Problem</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Employment scams are now among the fastest-growing scam types in Australia, with losses reaching millions of dollars annually.</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 40% increase in job scam reports in 2024</li>
                  <li>• Average loss of $3,500 per victim</li>
                  <li>• 70% of victims are under 35 years old</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <span>Who's Targeted</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Scammers particularly target vulnerable populations seeking employment opportunities.</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• International students</li>
                  <li>• Recent graduates</li>
                  <li>• Job seekers in financial distress</li>
                  <li>• People seeking work-from-home opportunities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Red Flags</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>Learn to identify common warning signs of job scams before it's too late.</p>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Requests for upfront payments</li>
                  <li>• "Too good to be true" salary offers</li>
                  <li>• Immediate job offers without interviews</li>
                  <li>• Requests for personal documents early</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Common Scam Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Fake Job Postings</h4>
                    <p className="text-sm text-gray-600">
                      Fraudulent job advertisements that collect personal information or request payments 
                      for non-existent positions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Payment Scams</h4>
                    <p className="text-sm text-gray-600">
                      Scammers request upfront payments for "training materials," "background checks," 
                      or "equipment" that never arrives.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Identity Theft</h4>
                    <p className="text-sm text-gray-600">
                      Fake employers request personal documents, bank details, or other sensitive 
                      information to steal identities.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Pyramid Schemes</h4>
                    <p className="text-sm text-gray-600">
                      Multi-level marketing schemes disguised as legitimate employment opportunities, 
                      often targeting students.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Official Resources & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Report Scams</h4>
                  <div className="space-y-2 text-sm">
                    <a 
                      href="https://scamwatch.accc.gov.au" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>ACCC Scamwatch</span>
                    </a>
                    <a 
                      href="https://cyber.gov.au" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Australian Cyber Security Centre</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Get Help</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Scamwatch Hotline: 1300 795 995</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>report-cybercrime@afp.gov.au</span>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Remember:</strong> If you've been scammed, report it immediately to authorities and your bank. 
                  Early reporting can help prevent further damage and protect others.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}