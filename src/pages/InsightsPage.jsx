import { ReportsViewer } from '../components/ReportsViewer.jsx'

export function InsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Insights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View recent job scam reports from the community to stay informed about current threats.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ReportsViewer />
        </div>
      </div>
    </div>
  )
}
