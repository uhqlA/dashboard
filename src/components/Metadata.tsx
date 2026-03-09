interface MetadataProps {
  region?: string;
  wetlandsArea?: string;
  lastUpdated?: string;
  dataSource?: string;
}

const Metadata = ({ 
  region = 'Marsabit County', 
  wetlandsArea = '1200 sq km', 
  lastUpdated = 'February 18, 2026', 
  dataSource = 'Environmental Monitoring System' 
}: MetadataProps) => {
  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600">
      <h3 className="font-bold border-b border-gray-200 dark:border-gray-600 pb-2 mb-4 text-slate-700 dark:text-slate-300">Metadata Info</h3>
      <div className="space-y-2">
        <p className="text-slate-600 dark:text-slate-400 font-medium">Region: <span className="text-slate-900 dark:text-white">{region}</span></p>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Wetlands Area: <span className="text-slate-900 dark:text-white">{wetlandsArea}</span></p>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Last Updated: <span className="text-slate-900 dark:text-white">{lastUpdated}</span></p>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Data Source: <span className="text-slate-900 dark:text-white">{dataSource}</span></p>
      </div>
    </div>
  );
};

export default Metadata;