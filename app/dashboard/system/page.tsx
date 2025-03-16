'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { FiRefreshCw } from 'react-icons/fi';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import UsageGauge from '@/components/system/UsageGauge';
import SystemInfoCard from '@/components/system/SystemInfoCard';

interface SystemInfo {
  cpuUsage: number;
  memoryUsage: {
    total: number;
    free: number;
    used: number;
    percentUsed: number;
  };
  uptime: number;
  platform: string;
  hostname: string;
  cpuInfo: {
    model: string;
    cores: number;
    speed: number;
  };
  osInfo: {
    type: string;
    release: string;
    arch: string;
  };
  loadAverage: number[];
  networkInterfaces: {
    [key: string]: {
      address: string;
      netmask: string;
      family: string;
      mac: string;
      internal: boolean;
      cidr: string;
    }[];
  };
}

export default function SystemPage() {
  const { data: session } = useSession();
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(5000);
  
  const fetchSystemInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/system/info');
      setSystemInfo(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch system information');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSystemInfo();
  }, []);

  // Setup refresh interval
  useEffect(() => {
    if (refreshInterval === 0) return;
    
    const intervalId = setInterval(fetchSystemInfo, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format uptime to human-readable format
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (parts.length === 0) parts.push(`${Math.floor(seconds)}s`);
    
    return parts.join(' ');
  };

  // InfoRow component for consistent styling
  const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">System Information</h1>
            <button
              onClick={fetchSystemInfo}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Refresh system info"
              disabled={isLoading}
            >
              <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span>{error}</span>
            </div>
          )}

          {isLoading && !systemInfo ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading system information...</p>
            </div>
          ) : systemInfo && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Gauges */}
              <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Resource Usage</h2>
                <div className="flex flex-wrap justify-around gap-8">
                  <UsageGauge 
                    value={systemInfo.cpuUsage} 
                    label="CPU Usage" 
                    size="lg" 
                  />
                  <UsageGauge 
                    value={systemInfo.memoryUsage.percentUsed} 
                    label="Memory Usage" 
                    size="lg" 
                    color={systemInfo.memoryUsage.percentUsed > 80 ? 'red' : systemInfo.memoryUsage.percentUsed > 50 ? 'yellow' : 'green'}
                  />
                </div>
              </div>
              
              {/* System Information */}
              <SystemInfoCard title="System">
                <InfoRow label="Hostname" value={systemInfo.hostname} />
                <InfoRow label="Platform" value={systemInfo.platform} />
                <InfoRow label="OS" value={`${systemInfo.osInfo.type} ${systemInfo.osInfo.release}`} />
                <InfoRow label="Architecture" value={systemInfo.osInfo.arch} />
                <InfoRow label="Uptime" value={formatUptime(systemInfo.uptime)} />
              </SystemInfoCard>
              
              {/* CPU Information */}
              <SystemInfoCard title="CPU">
                <InfoRow label="Model" value={systemInfo.cpuInfo.model} />
                <InfoRow label="Cores" value={systemInfo.cpuInfo.cores} />
                <InfoRow label="Speed" value={`${systemInfo.cpuInfo.speed} MHz`} />
                <InfoRow label="Load Average" value={systemInfo.loadAverage.map(load => load.toFixed(2)).join(' | ')} />
              </SystemInfoCard>
              
              {/* Memory Information */}
              <SystemInfoCard title="Memory">
                <InfoRow label="Total" value={formatBytes(systemInfo.memoryUsage.total)} />
                <InfoRow label="Used" value={formatBytes(systemInfo.memoryUsage.used)} />
                <InfoRow label="Free" value={formatBytes(systemInfo.memoryUsage.free)} />
              </SystemInfoCard>
              
              {/* Network Information */}
              <SystemInfoCard title="Network Interfaces">
                {Object.entries(systemInfo.networkInterfaces).map(([name, interfaces]) => (
                  <div key={name} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-md mb-2">{name}</h3>
                    {interfaces.map((iface, index) => (
                      iface.family === 'IPv4' && !iface.internal && (
                        <div key={index} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                          <InfoRow label="IP Address" value={iface.address} />
                          <InfoRow label="MAC Address" value={iface.mac} />
                        </div>
                      )
                    ))}
                  </div>
                ))}
              </SystemInfoCard>
            </div>
          )}
          
          {/* Refresh Interval Selection */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Refresh Settings</h2>
            <div className="flex items-center">
              <span className="mr-4">Auto-refresh:</span>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="block p-2 border rounded bg-white dark:bg-gray-700"
              >
                <option value={0}>Off</option>
                <option value={5000}>Every 5 seconds</option>
                <option value={10000}>Every 10 seconds</option>
                <option value={30000}>Every 30 seconds</option>
                <option value={60000}>Every minute</option>
              </select>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
