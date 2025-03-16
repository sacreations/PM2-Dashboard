'use client';

import { useState, useEffect } from 'react';

interface UsageGaugeProps {
  value: number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export default function UsageGauge({
  value,
  label,
  color = 'blue',
  size = 'md',
}: UsageGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animate the gauge filling up
  useEffect(() => {
    const duration = 1000; // animation duration in ms
    const interval = 10; // update interval in ms
    const steps = duration / interval;
    const step = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        current = value;
        clearInterval(timer);
      }
      setDisplayValue(current);
    }, interval);
    
    return () => clearInterval(timer);
  }, [value]);
  
  // Calculate size based on prop
  const sizeClass = {
    sm: 'w-20 h-20 text-xs',
    md: 'w-32 h-32 text-sm',
    lg: 'w-40 h-40 text-base',
  }[size];
  
  // Calculate color based on value and prop
  const getColor = () => {
    if (color !== 'blue') {
      return {
        green: 'text-green-500',
        yellow: 'text-yellow-500',
        red: 'text-red-500',
        blue: 'text-blue-500',
      }[color];
    }
    
    // Default dynamic color based on value
    if (value < 50) return 'text-green-500';
    if (value < 80) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Calculate the stroke dasharray and dashoffset for the circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClass} flex items-center justify-center`}>
        {/* Background circle */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 stroke-current"
            strokeWidth="8"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
          />
        </svg>
        
        {/* Progress circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className={`${getColor()} stroke-current`}
            strokeWidth="8"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        
        {/* Percentage text */}
        <div className="text-center">
          <div className="text-3xl font-bold">{Math.round(displayValue)}%</div>
        </div>
      </div>
      
      <div className="mt-2 font-medium text-gray-700 dark:text-gray-300">{label}</div>
    </div>
  );
}
