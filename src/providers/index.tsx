'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from './WagmiProvider';
import { QueryProvider } from './QueryProvider';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </WagmiProvider>
  );
}