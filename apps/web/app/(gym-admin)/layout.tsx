import { Plus_Jakarta_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { AdminHeader } from './_components/admin-header';
import { AdminNav } from './_components/admin-nav';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function GymAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${jakarta.className} min-h-screen bg-surface text-on-surface antialiased`}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        precedence="default"
      />

      <AdminNav />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
