'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { WagmiProvider as WagmiProviderBase, createConfig } from 'wagmi';
import { coinbaseWallet, walletConnect, metaMask } from 'wagmi/connectors';
import { siteConfig } from '../config/site';
import { sepolia } from 'wagmi/chains';
import { http } from 'viem';

function safeWindowCheck() {
  if (typeof window === 'undefined') return false;
  return true;
}

export function WagmiProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  const createAppConfig = useCallback(() => {
    const sepoliaRpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || siteConfig.defaultRpcUrls.sepolia;
    const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

    if (!safeWindowCheck()) {
      return createConfig({
        chains: [sepolia],
        connectors: [],
        transports: {
          [sepolia.id]: http(sepoliaRpcUrl),
        },
      });
    }
  
    try {
      const connectors = [];

      if (typeof window !== 'undefined' && window.ethereum) {
        connectors.push(
          metaMask({
            dappMetadata: {
              name: 'Cypherpunks Community',
              url: window.location.origin,
              iconUrl: `${window.location.origin}/notwrjo.png`
            },
          })
        );
      }

      connectors.push(
        coinbaseWallet({
          appName: 'Cypherpunks Community',
          appLogoUrl: `${window.location.origin}/notwrjo.png`,
          preference: {
            options: 'eoaOnly'
          },
        })
      );

      if (walletConnectProjectId && walletConnectProjectId.length > 0) {
        connectors.push(
          walletConnect({
            projectId: walletConnectProjectId,
            metadata: {
              name: 'Cypherpunks Community',
              description: 'Cypherpunks Community',
              url: window.location.origin,
              icons: [`${window.location.origin}/notwrjo.png`]
            }
          })
        );
      } else {
        console.warn('WalletConnect Project ID not set. WalletConnect will be unavailable.');
      }

      return createConfig({
        chains: [sepolia],
        connectors,
        transports: {
          [sepolia.id]: http(sepoliaRpcUrl),
        },
      });
    } catch (error) {
      console.error('Error creating wagmi config:', error);
      
      return createConfig({
        chains: [sepolia],
        connectors: [],
        transports: {
          [sepolia.id]: http(sepoliaRpcUrl),
        },
      });
    }
  }, []);
  
  const [config] = useState(() => createAppConfig());
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProviderBase config={config}>
      {children}
    </WagmiProviderBase>
  );
} 