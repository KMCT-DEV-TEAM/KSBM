import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../api/axios';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This will hit the endpoint. If the access token is expired, 
        // the axios interceptor will automatically try to refresh it first.
        // If everything fails, it throws an error and we block access.
        await api.get('/users/me');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace(`/admin/login?from=${pathname}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1a237e] mb-4"></div>
        <p className="text-gray-500 font-medium">Verifying session...</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
