'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ProcessList from '@/components/dashboard/ProcessList';
import LogViewer from '@/components/dashboard/LogViewer';
import RefreshIntervalSelector from '@/components/dashboard/RefreshIntervalSelector';

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(5000); // 5 seconds default
  
  // Handle process selection
  const handleSelectProcess = (processId: string) => {
    setSelectedProcess(processId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Process Dashboard</h1>
            <RefreshIntervalSelector 
              value={refreshInterval}
              onChange={setRefreshInterval}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProcessList 
                refreshInterval={refreshInterval}
                onSelectProcess={handleSelectProcess}
                selectedProcess={selectedProcess}
              />
            </div>
            
            <div className="lg:col-span-1">
              <LogViewer 
                processId={selectedProcess}
                refreshInterval={refreshInterval}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
