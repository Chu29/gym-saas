'use client';

import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;

    const checkOnboardingStatus = async () => {
      if (!user) {
        // User not authenticated, middleware will handle redirect
        return;
      }

      // Skip redirect if already on onboarding page
      if (pathname === '/onboarding') {
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/tenants/status', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();

          if (!data.hasTenant && pathname !== '/onboarding') {
            // User has no tenant, redirect to onboarding
            router.push('/onboarding');
          } else if (data.hasTenant && data.tenant) {
            // User has tenant, redirect to appropriate dashboard
            const role = user.publicMetadata.role as string;

            if (role === 'GYM_ADMIN' && pathname !== '/admin/memberships') {
              router.push('/admin/memberships');
            } else if (role === 'SUPER_ADMIN' && pathname !== '/super-admin') {
              router.push('/super-admin');
            } else if (role === 'MEMBER' && pathname !== '/member') {
              router.push('/member');
            }
          }
        }
      } catch {
        // Ignore status check failures; middleware still protects private routes
      }
    };

    checkOnboardingStatus();
  }, [user, isLoaded, router, pathname]);

  return <>{children}</>;
}
