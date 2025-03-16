import { FiPlay, FiPause, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

interface ProcessCardProps {
  process: {
    pid: number;
    name: string;
    pm_id: number;
    monit: {
      memory: number;
      cpu: number;
    };
    pm2_env: {
      status: string;
      pm_uptime: number;
      instances: number;
      restart_time: number;
    };
  };
  onAction: (action: string, pm_id: number) => void;
  onSelect: () => void;
  isSelected: boolean;
}

export default function ProcessCard({ process, onAction, onSelect, isSelected }: ProcessCardProps) {
  // Format memory usage
  const formatMemory = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Format uptime
  const formatUptime = (uptime: number): string => {
    const seconds = Math.floor((Date.now() - uptime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const statusColor = process.pm2_env.status === 'online' 
    ? 'bg-green-500' 
    : process.pm2_env.status === 'stopped' 
      ? 'bg-red-500' 
      : 'bg-yellow-500';

  return (
    <div 
      onClick={onSelect}
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
          <h3 className="font-semibold">{process.name}</h3>
          <span className="text-sm text-gray-500">ID: {process.pm_id}</span>
          {process.pid && <span className="text-sm text-gray-500">PID: {process.pid}</span>}
        </div>
        
        <div className="flex space-x-2">
          {process.pm2_env.status === 'online' ? (
            <button
              onClick={(e) => { e.stopPropagation(); onAction('stop', process.pm_id); }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              title="Stop"
            >
              <FiPause className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAction('start', process.pm_id); }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              title="Start"
            >
              <FiPlay className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={(e) => { e.stopPropagation(); onAction('restart', process.pm_id); }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            title="Restart"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onAction('delete', process.pm_id); }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            title="Delete"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-sm">
          <p className="text-gray-500">Status</p>
          <p className="font-medium">{process.pm2_env.status}</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Uptime</p>
          <p className="font-medium">{formatUptime(process.pm2_env.pm_uptime)}</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">CPU</p>
          <p className="font-medium">{process.monit.cpu.toFixed(1)}%</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Memory</p>
          <p className="font-medium">{formatMemory(process.monit.memory)}</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Instances</p>
          <p className="font-medium">{process.pm2_env.instances || 1}</p>
        </div>
        
        <div className="text-sm">
          <p className="text-gray-500">Restarts</p>
          <p className="font-medium">{process.pm2_env.restart_time}</p>
        </div>
      </div>
    </div>
  );
}
