'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/layouts/navbar/Navbar';
import FloatingNav from '@/layouts/footer/FloatingNav';

interface IConditionalLayoutProps {
  currentUser: any;
  children: React.ReactNode;
}

export default function ConditionalLayout({ currentUser, children }: IConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar currentUser={currentUser} />}
      {children}
      {!isAdminPage && <FloatingNav currentUser={currentUser} />}
    </>
  );
}
