import { Shield, AlertTriangle, Search, FileText } from 'lucide-react'
import { Button } from './ui/button'

export function Header() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">JobScam Shield</h1>
              <p className="text-sm text-gray-600">Protecting Australian job seekers</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('tools')}
              className="flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Tools</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('reporting')}
              className="flex items-center space-x-1"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report</span>
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('about')}
              className="flex items-center space-x-1"
            >
              <FileText className="h-4 w-4" />
              <span>About</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}