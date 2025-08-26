import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ToolsSection } from './components/ToolsSection'
import { ReportingSection } from './components/ReportingSection'
import { AboutSection } from './components/AboutSection'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ToolsSection />
        <ReportingSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}