'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AuthService } from '@/lib/services/auth.service';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication with a small delay to prevent race conditions
    const checkAuth = () => {
      const token = AuthService.getToken();
      console.log('🔍 Checking auth in dashboard layout. Token:', token ? `exists (${token.substring(0, 20)}...)` : 'missing');

      // Log localStorage contents for debugging
      console.log('🔍 All localStorage keys:', Object.keys(localStorage));
      console.log('🔍 auth_token value:', localStorage.getItem('auth_token') ? 'EXISTS' : 'NULL');

      if (!token) {
        console.log('❌ No token found, redirecting to login...');
        router.push('/login');
      } else {
        console.log('✅ Token found, user is authenticated');
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    };

    // Small delay to ensure localStorage is ready
    setTimeout(checkAuth, 100);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
