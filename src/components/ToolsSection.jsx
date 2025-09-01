import { EmployerVerification } from './EmployerVerification.jsx'
import { JobAdChecker } from './JobAdChecker.jsx'

export function ToolsSection() {
  return (
    <section id="tools" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Protection Tools</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use our free tools to verify employers and check job postings before you apply. 
            Stay one step ahead of scammers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <EmployerVerification />
          <JobAdChecker />
        </div>
      </div>
    </section>
  )
}
