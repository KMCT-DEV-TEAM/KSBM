import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../api/axios';
import Loader from '../components/Loader';

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
      <Loader fullScreen={true} theme="dark" text="Verifying session..." />
    );
  }

  return children;
};

export default ProtectedRoute;
