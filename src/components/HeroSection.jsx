import { AlertTriangle, Users, TrendingUp } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { Card, CardContent } from './ui/card.jsx'
import { ImageWithFallback } from './figma/ImageWithFallback.jsx'

export function HeroSection() {
  const scrollToTools = () => {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1652739758426-56a564265f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNlYSUyMHNlY3VyaXR5JTIwc2hpZWxkJTIwcHJvdGVjdGlvbnxlbnwxfHx8fDE3NTU3NjkzNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Business security and protection"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
        {/* Additional overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <AlertTriangle className="h-16 w-16 text-orange-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl mb-6 text-white drop-shadow-lg">
            Protect Yourself from Job Scams
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 drop-shadow-md">
            In Australia, employment scams have become one of the fastest-growing types of scams, 
            severely impacting vulnerable populations such as international students and young job seekers.
          </p>
          <Button 
            onClick={scrollToTools}
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
          >
            Use Our Protection Tools
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="bg-red-100 rounded-full p-3 w-fit mx-auto mb-4">
                <TrendingUp className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="mb-2 text-gray-900">Growing Threat</h3>
              <p className="text-gray-700">
                Employment scams are now among the fastest-growing scam types in Australia
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="bg-orange-100 rounded-full p-3 w-fit mx-auto mb-4">
                <Users className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="mb-2 text-gray-900">Vulnerable Groups</h3>
              <p className="text-gray-700">
                International students and young job seekers are particularly at risk
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-4">
                <AlertTriangle className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="mb-2 text-gray-900">Stay Protected</h3>
              <p className="text-gray-700">
                Use our verification tools and reporting system to stay safe
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}