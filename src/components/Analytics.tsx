import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

interface TreeStats {
  county_id: number;
  county_code: string;
  total_seedlings: number;
  total_survived: number;
  total_hectares: number;
  planting_count: number;
  survival_rate: number;
  organisations: string[];
  species: string[];
}

interface AnalyticsProps {
  selectedCounty?: string;
}

const Analytics = ({ selectedCounty = 'Marsabit County' }: AnalyticsProps) => {
  const [treeStats, setTreeStats] = useState<Record<string, TreeStats>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tree data from API
  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/tree-data/`);
        if (!response.ok) throw new Error('Failed to fetch tree data');
        const data = await response.json();
        
        if (data.status === 'success' && data.county_stats) {
          setTreeStats(data.county_stats);
        }
      } catch (err) {
        setError('Failed to load tree planting data');
        console.error('Error fetching tree data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreeData();
  }, []);

  // Get stats for selected county
  const countyKey = Object.keys(treeStats).find(key => 
    key.toLowerCase().includes(selectedCounty.toLowerCase().replace(' county', ''))
  );
  const stats = countyKey ? treeStats[countyKey] : null;

  // Seedling survival chart data
  const seedlingData = stats ? [
    { name: 'Survived', value: stats.total_survived, color: '#22c55e' },
    { name: 'Lost', value: Math.max(0, stats.total_seedlings - stats.total_survived), color: '#ef4444' }
  ] : [];

  // Species breakdown
  const speciesData = stats?.species.slice(0, 5).map((species, idx) => ({
    name: species,
    value: Math.round(stats.total_seedlings / (stats.species.length || 1)),
    color: ['#22c55e', '#84cc16', '#3b82f6', '#f59e0b', '#8b5cf6'][idx]
  })) || [];

  if (loading) {
    return (
      <div className="h-full w-full p-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Jazamiti tree data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full p-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-100 dark:bg-gray-800 z-10 pb-2">
        <h3 className="font-bold border-b border-gray-200 dark:border-gray-600 pb-2 text-slate-700 dark:text-slate-300">
          {selectedCounty} - Tree Planting Analytics
        </h3>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Total Seedlings</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {stats?.total_seedlings?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Survival Rate</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.survival_rate?.toFixed(1) || '0'}%
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Area Covered</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {stats?.total_hectares?.toFixed(1) || '0'} ha
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Planting Sites</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {stats?.planting_count || '0'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Seedling Survival */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Seedling Survival</h4>
          {stats && stats.total_seedlings > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={seedlingData}
                  cx="50%"
                  cy="50%"
                  label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                  outerRadius={70}
                  dataKey="value"
                >
                  {seedlingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              No tree data available
            </div>
          )}
        </div>

        {/* Species Distribution */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Top Species Planted</h4>
          {speciesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={speciesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              No species data available
            </div>
          )}
        </div>
      </div>

      {/* Organisations & Species List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Organisations</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {stats?.organisations?.length > 0 ? (
              stats.organisations.map((org, idx) => (
                <div key={idx} className="text-xs text-gray-600 dark:text-gray-300 p-1 bg-gray-50 dark:bg-gray-600 rounded">
                  {org}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">No organisation data</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Tree Species</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {stats?.species?.length > 0 ? (
              stats.species.map((species, idx) => (
                <div key={idx} className="text-xs text-gray-600 dark:text-gray-300 p-1 bg-gray-50 dark:bg-gray-600 rounded flex justify-between">
                  <span>{species}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">No species data</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Data Source: Jazamiti Tree Planting Database
      </div>
    </div>
  );
};

export default Analytics;
