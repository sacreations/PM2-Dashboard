'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiDownload } from 'react-icons/fi';

interface LogViewerProps {
  processId: string | null;
  refreshInterval: number;
}

export default function LogViewer({ processId, refreshInterval }: LogViewerProps) {
  const [logs, setLogs] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    if (!processId) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/pm2/logs/${processId}`);
      setLogs(response.data.logs);
      setError(null);
    } catch (err) {
      setError('Failed to fetch logs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when process changes
  useEffect(() => {
    if (processId) {
      fetchLogs();
    } else {
      setLogs('');
    }
  }, [processId]);

  // Setup refresh interval
  useEffect(() => {
    if (!processId) return;
    
    const intervalId = setInterval(fetchLogs, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval, processId]);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleDownload = () => {
    if (!logs || !processId) return;
    
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pm2-${processId}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {processId ? `Logs - Process ID: ${processId}` : 'Logs'}
        </h2>
        <div className="flex items-center space-x-2">
          {processId && (
            <>
              <button
                onClick={fetchLogs}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Refresh logs"
                disabled={isLoading}
              >
                <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleDownload}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Download logs"
                disabled={!logs}
              >
                <FiDownload className="h-5 w-5" />
              </button>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-scroll"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="auto-scroll" className="text-sm">Auto-scroll</label>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span>{error}</span>
        </div>
      )}

      {!processId ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Select a process to view logs</p>
        </div>
      ) : isLoading && !logs ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading logs...</p>
        </div>
      ) : (
        <div
          ref={logRef}
          className="font-mono text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto h-96"
        >
          {logs ? (
            logs.split('\n').map((line, i) => (
              <div key={i} className="whitespace-pre-wrap">
                {line || ' '}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No logs available</p>
          )}
        </div>
      )}
    </div>
  );
}
