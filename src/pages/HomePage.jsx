import { AlertTriangle, Users, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { ImageWithFallback } from '../components/figma/ImageWithFallback.jsx'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1652739758426-56a564265f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHNlY3VyaXR5JTIwc2hpZWxkJTIwcHJvdGVjdGlvbnxlbnwxfHx8fDE3NTU3NjkzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Business security and protection"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
          {/* Additional overlay for better contrast */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <AlertTriangle className="h-12 w-12 text-orange-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl mb-4 text-white drop-shadow-lg">
              Protect Yourself from Job Scams
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6 drop-shadow-md">
              In Australia, employment scams have become one of the fastest-growing types of scams, 
              severely impacting vulnerable populations such as international students and young job seekers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/url-checker">
                <Button 
                  size="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                >
                  Check URLs & Employers
                </Button>
              </Link>
              <Link to="/report-scam">
                <Button 
                  variant="outline"
                  size="default"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Learn About Scams
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="pt-4 text-center">
                <div className="bg-red-100 rounded-full p-2 w-fit mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mb-2 text-gray-900 text-sm font-semibold">Growing Threat</h3>
                <p className="text-gray-700 text-xs">
                  Employment scams are now among the fastest-growing scam types in Australia
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="pt-4 text-center">
                <div className="bg-orange-100 rounded-full p-2 w-fit mx-auto mb-3">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="mb-2 text-gray-900 text-sm font-semibold">Vulnerable Groups</h3>
                <p className="text-gray-700 text-xs">
                  International students and young job seekers are particularly at risk
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="pt-4 text-center">
                <div className="bg-blue-100 rounded-full p-2 w-fit mx-auto mb-3">
                  <AlertTriangle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-gray-900 text-sm font-semibold">Stay Protected</h3>
                <p className="text-gray-700 text-xs">
                  Use our verification tools and reporting system to stay safe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}