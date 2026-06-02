// hooks/useAuthGuard.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export const useAuthGuard = (allowedRoles = []) => {
  const router = useRouter();
  const { user, loading, accessToken } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user && !accessToken) {
        router.push('/login');
        return;
      }

      // Check role-based access
      if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        router.push(`/${user.role.toLowerCase()}/dashboard`);
        return;
      }

      // Check profile completion
      if (user && !user.profileCompleted && !window.location.pathname.includes('/complete-profile')) {
        router.push('/complete-profile');
        return;
      }

      // Check approval status
      if (user && user.profileCompleted && !user.isApproved && 
          !window.location.pathname.includes('/waiting-approval')) {
        router.push('/waiting-approval');
        return;
      }
    }
  }, [user, loading, router, allowedRoles]);

  return { user, loading, isAuthenticated: !!user && !!accessToken };
};