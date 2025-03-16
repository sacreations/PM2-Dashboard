'use client';

import { useState } from 'react';
import { FiClock } from 'react-icons/fi';

interface RefreshIntervalSelectorProps {
  value: number;
  onChange: (interval: number) => void;
}

export default function RefreshIntervalSelector({
  value,
  onChange
}: RefreshIntervalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const intervals = [
    { label: '5 seconds', value: 5000 },
    { label: '10 seconds', value: 10000 },
    { label: '30 seconds', value: 30000 },
    { label: '1 minute', value: 60000 },
    { label: '5 minutes', value: 300000 },
    { label: 'Off', value: 0 }
  ];
  
  const getCurrentLabel = () => {
    const interval = intervals.find(i => i.value === value);
    return interval ? interval.label : 'Custom';
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
      >
        <FiClock className="h-4 w-4" />
        <span>Refresh: {getCurrentLabel()}</span>
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 py-1">
            {intervals.map((interval) => (
              <button
                key={interval.value}
                onClick={() => {
                  onChange(interval.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  value === interval.value
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {interval.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
