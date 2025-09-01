import { Shield, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="font-bold">JobScam Shield</span>
            </div>
            <p className="text-gray-400 text-sm">
              Protecting Australian job seekers from employment scams through community-driven verification and reporting.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#tools" className="block text-gray-400 hover:text-white transition-colors">
                Verification Tools
              </a>
              <a href="#reporting" className="block text-gray-400 hover:text-white transition-colors">
                Report Scams
              </a>
              <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                About Job Scams
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Official Resources</h4>
            <div className="space-y-2 text-sm">
              <a 
                href="https://scamwatch.accc.gov.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
              >
                <span>ACCC Scamwatch</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://cyber.gov.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
              >
                <span>Cyber Security Centre</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://fairwork.gov.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
              >
                <span>Fair Work Ombudsman</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Emergency Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>If you believe you've been scammed:</p>
              <div className="space-y-1">
                <p>Phone: Scamwatch: 1300 795 995</p>
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>report-cybercrime@afp.gov.au</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © 2025 JobScam Shield. This is a community protection tool. 
            Always verify information independently and report suspected scams to official authorities.
          </p>
        </div>
      </div>
    </footer>
  )
}
