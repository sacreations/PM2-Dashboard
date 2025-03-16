'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

let inactivityTimer: NodeJS.Timeout;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  
  // Reset timer on user activity
  const resetInactivityTimer = () => {
    setLastActivity(Date.now());
  };
  
  // Add event listeners for user activity
  useEffect(() => {
    if (!pathname?.startsWith('/dashboard')) return;
    
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [pathname]);
  
  // Check for inactivity
  useEffect(() => {
    if (!pathname?.startsWith('/dashboard')) return;
    
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
      // Auto logout after 30 minutes of inactivity
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > 30 * 60 * 1000) {
        router.push('/api/auth/signout?callbackUrl=/login');
      }
    }, 60 * 1000); // Check every minute
    
    return () => clearTimeout(inactivityTimer);
  }, [lastActivity, pathname, router]);

  return <SessionProvider>{children}</SessionProvider>;
}
