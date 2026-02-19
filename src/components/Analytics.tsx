import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const barData = [
  { name: 'Jan', wetlands: 1200 },
  { name: 'Feb', wetlands: 1180 },
  { name: 'Mar', wetlands: 1220 },
  { name: 'Apr', wetlands: 1250 },
  { name: 'May', wetlands: 1280 },
  { name: 'Jun', wetlands: 1300 },
];

const lineData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 280 },
  { name: 'May', value: 590 },
  { name: 'Jun', value: 320 },
];

const pieData = [
  { name: 'Forested', value: 400, color: '#8884d8' },
  { name: 'Grassland', value: 300, color: '#82ca9d' },
  { name: 'Wetlands', value: 300, color: '#ffc658' },
  { name: 'Urban', value: 200, color: '#ff7300' },
];

const metadata = {
  region: 'Marsabit County',
  wetlandsArea: '1200 sq km',
  lastUpdated: 'February 18, 2026',
  dataSource: 'Environmental Monitoring System'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
        <p className="font-semibold dark:text-white">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="dark:text-gray-300">
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
        <hr className="my-2 dark:border-gray-600" />
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <div><strong>Region:</strong> {metadata.region}</div>
          <div><strong>Area:</strong> {metadata.wetlandsArea}</div>
          <div><strong>Updated:</strong> {metadata.lastUpdated}</div>
        </div>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  return (
    <div className="h-full w-full p-4 bg-gray-100 dark:bg-gray-800">
      <h3 className="font-bold border-b border-gray-200 dark:border-gray-600 pb-2 mb-4 text-slate-700 dark:text-slate-300">Analytics Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Bar Chart */}
        <div className="h-64">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Wetlands Area (sq km)</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="wetlands" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="h-64">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Trend Analysis</h4>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="h-64">
          <h4 className="text-sm font-semibold mb-2 dark:text-white">Land Use Distribution</h4>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;