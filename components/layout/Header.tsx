'use client';

import { useSession, signOut } from 'next-auth/react';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              PM2 Dashboard
            </h1>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <FiUser className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {session?.user?.name || 'User'}
              </span>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <FiLogOut className="h-5 w-5 mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
