'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCw } from 'react-icons/fi';
// Fix the import by removing the file extension
import ProcessCard from './ProcessCard';

interface ProcessListProps {
  refreshInterval: number;
  onSelectProcess: (processId: string) => void;
  selectedProcess: string | null;
}

interface Process {
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
}

export default function ProcessList({
  refreshInterval,
  onSelectProcess,
  selectedProcess
}: ProcessListProps) {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/pm2/list');
      setProcesses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch processes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProcesses();
  }, []);

  // Setup refresh interval
  useEffect(() => {
    const intervalId = setInterval(fetchProcesses, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const handleAction = async (action: string, pm_id: number) => {
    try {
      await axios.post(`/api/pm2/${action}`, { pm_id });
      // Refresh process list after action
      fetchProcesses();
    } catch (err) {
      setError(`Failed to ${action} process`);
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Processes</h2>
        <button 
          onClick={fetchProcesses}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Refresh processes"
        >
          <FiRefreshCw className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span>{error}</span>
        </div>
      )}

      {isLoading && <p className="text-center py-4">Loading processes...</p>}

      {!isLoading && processes.length === 0 && (
        <p className="text-center py-4">No processes found</p>
      )}

      <div className="space-y-4">
        {processes.map((process) => (
          <ProcessCard 
            key={process.pm_id}
            process={process}
            onAction={handleAction}
            onSelect={() => onSelectProcess(process.pm_id.toString())}
            isSelected={selectedProcess === process.pm_id.toString()}
          />
        ))}
      </div>
    </div>
  );
}
