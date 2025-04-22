'use client'

import { ReactNode } from 'react';
import Image from 'next/image';

export default function BackgroundLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          priority
          quality={85}
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}