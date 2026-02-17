import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">Welcome to the Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Content Area Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 h-64 flex items-center justify-center">
            <span className="text-gray-400 italic font-medium">Interactive Map Placeholder</span>
          </div>

          {/* Metadata Card Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 h-64">
            <h3 className="font-bold border-b border-gray-200 pb-2 mb-4 text-slate-700">Metadata Info</h3>
            <div className="space-y-2">
              <p className="text-slate-600 font-medium">Region: <span className="text-slate-900">Marsabit County</span></p>
              <p className="text-slate-600 font-medium">Wetlands Area: <span className="text-slate-900">1200 sq km</span></p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;