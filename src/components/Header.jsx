import { Shield, AlertTriangle, Search, FileText, BarChart3 } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">JobScam Shield</h1>
              <p className="text-sm text-gray-600">Protecting Australian job seekers</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/url-checker">
              <Button 
                variant={isActive('/url-checker') ? "default" : "ghost"}
                className="flex items-center space-x-1"
              >
                <Search className="h-4 w-4" />
                <span>URL Checker</span>
              </Button>
            </Link>
            <Link to="/insights">
              <Button 
                variant={isActive('/insights') ? "default" : "ghost"}
                className="flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Insights</span>
              </Button>
            </Link>
            <Link to="/report-scam">
              <Button 
                variant={isActive('/report-scam') ? "default" : "ghost"}
                className="flex items-center space-x-1"
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Report Scam</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
