import { ReportingPortal } from './ReportingPortal'

export function ReportingSection() {
  return (
    <section id="reporting" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Report & Protect</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help protect the community by reporting scams and staying informed about current threats. 
            Your reports help us identify patterns and warn others.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ReportingPortal />
        </div>
      </div>
    </section>
  )
}