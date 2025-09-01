import { EmployerVerification } from '../components/EmployerVerification.jsx'
import { JobAdChecker } from '../components/JobAdChecker.jsx'

export function UrlCheckerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">URL Checker</h1>
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
    </div>
  )
}
