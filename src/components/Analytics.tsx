import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// County-specific environmental data
const countyData = {
  'Marsabit County': {
    wetlandsArea: '1200 sq km',
    lastUpdated: 'February 18, 2026',
    dataSource: 'Environmental Monitoring System',
    monthlyWetlands: [
      { name: 'Jan', wetlands: 1180, rainfall: 45, temperature: 28 },
      { name: 'Feb', wetlands: 1160, rainfall: 38, temperature: 29 },
      { name: 'Mar', wetlands: 1190, rainfall: 52, temperature: 27 },
      { name: 'Apr', wetlands: 1220, rainfall: 68, temperature: 26 },
      { name: 'May', wetlands: 1250, rainfall: 85, temperature: 25 },
      { name: 'Jun', wetlands: 1280, rainfall: 92, temperature: 24 },
    ],
    waterQuality: [
      { name: 'Jan', ph: 7.2, dissolvedOxygen: 8.5, turbidity: 2.1 },
      { name: 'Feb', ph: 7.1, dissolvedOxygen: 8.3, turbidity: 2.3 },
      { name: 'Mar', ph: 7.3, dissolvedOxygen: 8.6, turbidity: 1.9 },
      { name: 'Apr', ph: 7.2, dissolvedOxygen: 8.4, turbidity: 2.0 },
      { name: 'May', ph: 7.4, dissolvedOxygen: 8.7, turbidity: 1.8 },
      { name: 'Jun', ph: 7.3, dissolvedOxygen: 8.5, turbidity: 1.9 },
    ],
    landUse: [
      { name: 'Forest Cover', value: 35, color: '#22c55e' },
      { name: 'Grassland', value: 28, color: '#84cc16' },
      { name: 'Wetlands', value: 22, color: '#3b82f6' },
      { name: 'Agricultural', value: 10, color: '#f59e0b' },
      { name: 'Urban', value: 5, color: '#ef4444' },
    ],
    biodiversity: {
      birdSpecies: 245,
      mammalSpecies: 58,
      plantSpecies: 892,
      endangeredSpecies: 12
    }
  },
  'Nairobi County': {
    wetlandsArea: '85 sq km',
    lastUpdated: 'February 18, 2026',
    dataSource: 'Nairobi Environmental Authority',
    monthlyWetlands: [
      { name: 'Jan', wetlands: 82, rainfall: 58, temperature: 24 },
      { name: 'Feb', wetlands: 80, rainfall: 52, temperature: 25 },
      { name: 'Mar', wetlands: 83, rainfall: 72, temperature: 23 },
      { name: 'Apr', wetlands: 85, rainfall: 125, temperature: 22 },
      { name: 'May', wetlands: 87, rainfall: 158, temperature: 21 },
      { name: 'Jun', wetlands: 88, rainfall: 142, temperature: 20 },
    ],
    waterQuality: [
      { name: 'Jan', ph: 6.8, dissolvedOxygen: 7.2, turbidity: 3.8 },
      { name: 'Feb', ph: 6.9, dissolvedOxygen: 7.4, turbidity: 3.5 },
      { name: 'Mar', ph: 7.0, dissolvedOxygen: 7.6, turbidity: 3.2 },
      { name: 'Apr', ph: 7.1, dissolvedOxygen: 7.8, turbidity: 2.9 },
      { name: 'May', ph: 7.0, dissolvedOxygen: 7.7, turbidity: 3.0 },
      { name: 'Jun', ph: 6.9, dissolvedOxygen: 7.5, turbidity: 3.3 },
    ],
    landUse: [
      { name: 'Urban', value: 45, color: '#ef4444' },
      { name: 'Industrial', value: 20, color: '#6b7280' },
      { name: 'Forest Cover', value: 15, color: '#22c55e' },
      { name: 'Agricultural', value: 12, color: '#f59e0b' },
      { name: 'Wetlands', value: 8, color: '#3b82f6' },
    ],
    biodiversity: {
      birdSpecies: 156,
      mammalSpecies: 32,
      plantSpecies: 445,
      endangeredSpecies: 8
    }
  },
  'Mombasa County': {
    wetlandsArea: '156 sq km',
    lastUpdated: 'February 18, 2026',
    dataSource: 'Coastal Environmental Monitoring',
    monthlyWetlands: [
      { name: 'Jan', wetlands: 152, rainfall: 28, temperature: 31 },
      { name: 'Feb', wetlands: 150, rainfall: 22, temperature: 32 },
      { name: 'Mar', wetlands: 154, rainfall: 45, temperature: 31 },
      { name: 'Apr', wetlands: 156, rainfall: 68, temperature: 29 },
      { name: 'May', wetlands: 158, rainfall: 125, temperature: 27 },
      { name: 'Jun', wetlands: 160, rainfall: 98, temperature: 26 },
    ],
    waterQuality: [
      { name: 'Jan', ph: 8.1, dissolvedOxygen: 7.8, turbidity: 1.5 },
      { name: 'Feb', ph: 8.2, dissolvedOxygen: 7.9, turbidity: 1.4 },
      { name: 'Mar', ph: 8.0, dissolvedOxygen: 7.7, turbidity: 1.6 },
      { name: 'Apr', ph: 8.1, dissolvedOxygen: 7.8, turbidity: 1.5 },
      { name: 'May', ph: 7.9, dissolvedOxygen: 7.6, turbidity: 1.7 },
      { name: 'Jun', ph: 8.0, dissolvedOxygen: 7.7, turbidity: 1.6 },
    ],
    landUse: [
      { name: 'Marine', value: 35, color: '#0ea5e9' },
      { name: 'Mangrove', value: 25, color: '#059669' },
      { name: 'Urban', value: 20, color: '#ef4444' },
      { name: 'Forest Cover', value: 12, color: '#22c55e' },
      { name: 'Agricultural', value: 8, color: '#f59e0b' },
    ],
    biodiversity: {
      birdSpecies: 312,
      mammalSpecies: 45,
      plantSpecies: 678,
      endangeredSpecies: 15
    }
  },
  'Kisumu County': {
    wetlandsArea: '425 sq km',
    lastUpdated: 'February 18, 2026',
    dataSource: 'Lake Victoria Basin Authority',
    monthlyWetlands: [
      { name: 'Jan', wetlands: 418, rainfall: 68, temperature: 26 },
      { name: 'Feb', wetlands: 415, rainfall: 58, temperature: 27 },
      { name: 'Mar', wetlands: 420, rainfall: 85, temperature: 25 },
      { name: 'Apr', wetlands: 425, rainfall: 125, temperature: 24 },
      { name: 'May', wetlands: 428, rainfall: 158, temperature: 23 },
      { name: 'Jun', wetlands: 430, rainfall: 142, temperature: 22 },
    ],
    waterQuality: [
      { name: 'Jan', ph: 7.5, dissolvedOxygen: 8.2, turbidity: 2.8 },
      { name: 'Feb', ph: 7.4, dissolvedOxygen: 8.1, turbidity: 2.9 },
      { name: 'Mar', ph: 7.6, dissolvedOxygen: 8.3, turbidity: 2.7 },
      { name: 'Apr', ph: 7.5, dissolvedOxygen: 8.2, turbidity: 2.8 },
      { name: 'May', ph: 7.4, dissolvedOxygen: 8.1, turbidity: 2.9 },
      { name: 'Jun', ph: 7.5, dissolvedOxygen: 8.2, turbidity: 2.8 },
    ],
    landUse: [
      { name: 'Lake Victoria', value: 30, color: '#0ea5e9' },
      { name: 'Wetlands', value: 25, color: '#3b82f6' },
      { name: 'Agricultural', value: 20, color: '#f59e0b' },
      { name: 'Grassland', value: 15, color: '#84cc16' },
      { name: 'Urban', value: 10, color: '#ef4444' },
    ],
    biodiversity: {
      birdSpecies: 428,
      mammalSpecies: 62,
      plantSpecies: 956,
      endangeredSpecies: 18
    }
  }
};

// Default data for counties not in the database
const getDefaultCountyData = (countyName: string) => ({
  wetlandsArea: 'Unknown',
  lastUpdated: 'February 18, 2026',
  dataSource: 'Environmental Monitoring System',
  monthlyWetlands: [
    { name: 'Jan', wetlands: 100, rainfall: 50, temperature: 25 },
    { name: 'Feb', wetlands: 105, rainfall: 45, temperature: 26 },
    { name: 'Mar', wetlands: 110, rainfall: 60, temperature: 24 },
    { name: 'Apr', wetlands: 115, rainfall: 80, temperature: 23 },
    { name: 'May', wetlands: 120, rainfall: 100, temperature: 22 },
    { name: 'Jun', wetlands: 125, rainfall: 90, temperature: 21 },
  ],
  waterQuality: [
    { name: 'Jan', ph: 7.0, dissolvedOxygen: 8.0, turbidity: 2.5 },
    { name: 'Feb', ph: 7.1, dissolvedOxygen: 8.1, turbidity: 2.4 },
    { name: 'Mar', ph: 7.0, dissolvedOxygen: 8.0, turbidity: 2.5 },
    { name: 'Apr', ph: 7.2, dissolvedOxygen: 8.2, turbidity: 2.3 },
    { name: 'May', ph: 7.1, dissolvedOxygen: 8.1, turbidity: 2.4 },
    { name: 'Jun', ph: 7.0, dissolvedOxygen: 8.0, turbidity: 2.5 },
  ],
  landUse: [
    { name: 'Forest Cover', value: 25, color: '#22c55e' },
    { name: 'Grassland', value: 25, color: '#84cc16' },
    { name: 'Wetlands', value: 20, color: '#3b82f6' },
    { name: 'Agricultural', value: 20, color: '#f59e0b' },
    { name: 'Urban', value: 10, color: '#ef4444' },
  ],
  biodiversity: {
    birdSpecies: 200,
    mammalSpecies: 40,
    plantSpecies: 500,
    endangeredSpecies: 10
  }
});

interface AnalyticsProps {
  selectedCounty?: string;
}

const CustomTooltip = ({ active, payload, label, countyData }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
        <p className="font-semibold dark:text-white">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="dark:text-gray-300">
            {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'ph' ? '' : entry.dataKey === 'temperature' ? '°C' : entry.dataKey === 'rainfall' ? 'mm' : ''}`}
          </p>
        ))}
        <hr className="my-2 dark:border-gray-600" />
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div><strong>Region:</strong> {countyData?.region || 'Unknown'}</div>
          <div><strong>Area:</strong> {countyData?.wetlandsArea || 'Unknown'}</div>
          <div><strong>Updated:</strong> {countyData?.lastUpdated || 'Unknown'}</div>
        </div>
      </div>
    );
  }
  return null;
};

const Analytics = ({ selectedCounty = 'Marsabit County' }: AnalyticsProps) => {
  const currentCountyData = countyData[selectedCounty as keyof typeof countyData] || getDefaultCountyData(selectedCounty);
  
  return (
    <div className="h-full w-full p-4 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-100 dark:bg-gray-800 z-10 pb-2">
        <h3 className="font-bold border-b border-gray-200 dark:border-gray-600 pb-2 text-slate-700 dark:text-slate-300">
          {selectedCounty} - Analytics Dashboard
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div><strong>Wetlands Area:</strong> {currentCountyData.wetlandsArea}</div>
          <div><strong>Source:</strong> {currentCountyData.dataSource}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Wetlands Area Chart */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Wetlands Area Trend (sq km)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={currentCountyData.monthlyWetlands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip countyData={{ region: selectedCounty, ...currentCountyData }} />} />
              <Bar dataKey="wetlands" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rainfall Chart */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Monthly Rainfall (mm)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={currentCountyData.monthlyWetlands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip countyData={{ region: selectedCounty, ...currentCountyData }} />} />
              <Line type="monotone" dataKey="rainfall" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Temperature Chart */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Average Temperature (°C)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={currentCountyData.monthlyWetlands}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip countyData={{ region: selectedCounty, ...currentCountyData }} />} />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Water Quality Chart */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Water Quality - pH Levels</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={currentCountyData.waterQuality}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[6, 9]} />
              <Tooltip content={<CustomTooltip countyData={{ region: selectedCounty, ...currentCountyData }} />} />
              <Line type="monotone" dataKey="ph" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Land Use Distribution */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Land Use Distribution (%)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={currentCountyData.landUse}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {currentCountyData.landUse.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip countyData={{ region: selectedCounty, ...currentCountyData }} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Biodiversity Stats */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Biodiversity Statistics</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Bird Species</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{currentCountyData.biodiversity.birdSpecies}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Mammal Species</span>
              <span className="font-bold text-green-600 dark:text-green-400">{currentCountyData.biodiversity.mammalSpecies}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Plant Species</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{currentCountyData.biodiversity.plantSpecies}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Endangered Species</span>
              <span className="font-bold text-red-600 dark:text-red-400">{currentCountyData.biodiversity.endangeredSpecies}</span>
            </div>
          </div>
        </div>

        {/* Environmental Indicators */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Environmental Indicators</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Water Quality</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 text-xs rounded-full">Good</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Air Quality</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 text-xs rounded-full">Moderate</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Forest Health</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 text-xs rounded-full">Healthy</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
              <span className="text-sm text-gray-700 dark:text-gray-300">Soil Quality</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 text-xs rounded-full">Fair</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;