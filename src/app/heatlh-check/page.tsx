export default function HealthCheck() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-green-600">✅ Health Check Passed</h1>
          <p className="text-gray-600 mt-2">Your Next.js + TailwindCSS app is up and running!</p>
        </div>
      </div>
    );
  }
  