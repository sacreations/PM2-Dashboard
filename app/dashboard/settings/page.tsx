'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [showNotifications, setShowNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('pm2-dashboard-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setAutoRefresh(settings.autoRefresh ?? true);
        setRefreshInterval(settings.refreshInterval ?? 5000);
        setShowNotifications(settings.showNotifications ?? true);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Save settings to local storage
      localStorage.setItem('pm2-dashboard-settings', JSON.stringify({
        autoRefresh,
        refreshInterval,
        showNotifications
      }));
      
      // Show success message
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          {message.text && (
            <div
              className={`mb-6 p-4 rounded ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-400'
                  : 'bg-red-100 text-red-700 border border-red-400'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <input
                        id="theme-light"
                        type="radio"
                        name="theme"
                        value="light"
                        checked={theme === 'light'}
                        onChange={() => setTheme('light')}
                        className="h-4 w-4 rounded border-gray-300 mr-2"
                      />
                      <label htmlFor="theme-light">Light Mode</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="theme-dark"
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={theme === 'dark'}
                        onChange={() => setTheme('dark')}
                        className="h-4 w-4 rounded border-gray-300 mr-2"
                      />
                      <label htmlFor="theme-dark">Dark Mode</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="theme-system"
                        type="radio"
                        name="theme"
                        value="system"
                        checked={theme === 'system'}
                        onChange={() => setTheme('system')}
                        className="h-4 w-4 rounded border-gray-300 mr-2"
                      />
                      <label htmlFor="theme-system">System Preference</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-4">Auto-refresh</h2>
                  <div className="flex items-center mb-4">
                    <input
                      id="auto-refresh"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 mr-2"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                    />
                    <label htmlFor="auto-refresh">
                      Enable auto-refresh
                    </label>
                  </div>
                  
                  {autoRefresh && (
                    <div>
                      <label htmlFor="refresh-interval" className="block mb-2">
                        Refresh interval
                      </label>
                      <select
                        id="refresh-interval"
                        value={refreshInterval}
                        onChange={(e) => setRefreshInterval(Number(e.target.value))}
                        className="block w-full sm:w-64 p-2 border rounded bg-white dark:bg-gray-700"
                      >
                        <option value={5000}>5 seconds</option>
                        <option value={10000}>10 seconds</option>
                        <option value={30000}>30 seconds</option>
                        <option value={60000}>1 minute</option>
                        <option value={300000}>5 minutes</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                  <div className="flex items-center">
                    <input
                      id="show-notifications"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 mr-2"
                      checked={showNotifications}
                      onChange={(e) => setShowNotifications(e.target.checked)}
                    />
                    <label htmlFor="show-notifications">
                      Show browser notifications
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
