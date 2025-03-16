'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMonitor, FiSettings, FiMenu, FiX, FiCpu } from 'react-icons/fi';

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`md:hidden fixed inset-0 z-20 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 w-64`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-500 focus:outline-none"
          >
            <FiX className="h-6 w-6" />
          </button>
          
          <SidebarContent />
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4">
          <SidebarContent />
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

function SidebarContent() {
  return (
    <nav className="space-y-2">
      <Link
        href="/dashboard"
        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FiMonitor className="h-5 w-5 mr-3" />
        <span>Processes</span>
      </Link>
      <Link
        href="/dashboard/system"
        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FiCpu className="h-5 w-5 mr-3" />
        <span>System</span>
      </Link>
      <Link
        href="/dashboard/settings"
        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FiSettings className="h-5 w-5 mr-3" />
        <span>Settings</span>
      </Link>
    </nav>
  );
}
