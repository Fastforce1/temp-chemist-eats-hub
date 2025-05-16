
// Removed React import as it's not used directly with new JSX transform

interface DashboardHeaderProps {
  title: string;
}

const DashboardHeader = ({ title }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center space-x-3">
        <span className="text-gray-500">View:</span>
        <select className="bg-white border border-gray-300 rounded-md text-gray-700 py-1 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 30 Days</option>
        </select>
      </div>
    </div>
  );
};

export default DashboardHeader;
