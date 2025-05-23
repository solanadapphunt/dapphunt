'use client';

import { usePathname } from 'next/navigation';
import { UiLayout } from '@/components/ui/ui-layout';
import { ReactNode } from 'react';

const solanaLinks: { label: string; path: string }[] = [
  { label: 'Account', path: '/solana/account' },
  { label: 'Clusters', path: '/solana/clusters' },
  { label: 'Counter Program', path: '/solana/counter' },
  { label: 'Dashboard', path: '/solana' },
];

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // If the current path starts with /solana, render with Solana UI layout
  if (pathname.startsWith('/solana')) {
    return <UiLayout links={solanaLinks}>{children}</UiLayout>;
  }
  
  // For all other paths (DappHunt app), render children directly
  return <>{children}</>;
} 