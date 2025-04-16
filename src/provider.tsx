"use client";

import { type ReactNode, useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { coinbaseWallet, walletConnect, metaMask } from "wagmi/connectors";
import { mainnet } from "wagmi/chains";
import { http } from "viem";

function safeWindowCheck() {
  if (typeof window === 'undefined') return false;
  return true;
}

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

type Props = {
  children: ReactNode;
};

export default function Provider({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  const createQueryClient = useCallback(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: true,
        gcTime: 0,
      },
    },
  }), []);
  
  const [queryClient] = useState(() => createQueryClient());
  
  const createAppConfig = useCallback(() => {
    if (!safeWindowCheck()) {
      return createConfig({
        chains: [mainnet],
        connectors: [],
        transports: {
          [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
        },
      });
    }
  
    try {
      const connectors = [];

      if (typeof window !== 'undefined' && window.ethereum) {
        connectors.push(
          metaMask({
            dappMetadata: {
              name: "Notwrjo Community",
              url: window.location.origin,
              iconUrl: `${window.location.origin}/notwrjo.png`
            },
          })
        );
      }

      connectors.push(
        coinbaseWallet({
          appName: "Notwrjo Community",
          appLogoUrl: `${window.location.origin}/notwrjo.png`,
          preference: {
            options: "eoaOnly"
          },
        })
      );

      if (WALLET_CONNECT_PROJECT_ID && WALLET_CONNECT_PROJECT_ID.length > 0) {
        connectors.push(
          walletConnect({
            projectId: WALLET_CONNECT_PROJECT_ID,
            metadata: {
              name: "Notwrjo Community",
              description: "Notwrjo Community",
              url: window.location.origin,
              icons: [`${window.location.origin}/notwrjo.png`]
            }
          })
        );
      } else {
        console.warn("WalletConnect Project ID not set. WalletConnect will be unavailable.");
      }

    return createConfig({
      chains: [mainnet],
      connectors,
      transports: {
        [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
      },
    });
  } catch (error) {
    console.error("Error creating wagmi config:", error);
    
    return createConfig({
      chains: [mainnet],
      connectors: [],
      transports: {
        [mainnet.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};