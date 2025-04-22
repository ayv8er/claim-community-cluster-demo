'use client'

import { useEffect, useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useClusterNameQuery } from '../hooks/useClusterNameQuery';
import WalletConnectorList from './WalletConnectorList';
import WalletInfo from './WalletInfo';

export default function Header({
  isWalletConnectModalOpen,
  setIsWalletConnectModalOpen,
}: {
  isWalletConnectModalOpen: boolean;
  setIsWalletConnectModalOpen: (isOpen: boolean) => void;
}) {
  const { data: clusterName } = useClusterNameQuery();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected) {
      setIsWalletConnectModalOpen(true);
    }
  }, [isConnected, setIsWalletConnectModalOpen]);

  const handleDisconnect = useCallback(() => {
    try {
      setIsWalletConnectModalOpen(false);
      disconnect();
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  }, [disconnect, setIsWalletConnectModalOpen]);

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative flex items-center">
        <button 
          disabled={isConnected}
          onClick={() => setIsWalletConnectModalOpen(!isWalletConnectModalOpen)}
          className={`font-bold text-lg p-2 select-none transition-transform ${isConnected ? '' : 'hover:cursor-pointer'}`}
        > 
          {isConnected ? 'Wallet Info' : 'Connect a Wallet'}
        </button>
      </div>
      
      <div className={`absolute top-15 left-1/2 -translate-x-1/2 z-10 transition-all duration-200 ${
        isWalletConnectModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="bg-white/5 backdrop-blur-md rounded-lg p-4 min-w-[280px] md:min-w-[360px]">
          {isConnected ? (
            <WalletInfo 
              address={address}
              clusterName={clusterName}
              onDisconnect={handleDisconnect}
            />
          ) : (
            <WalletConnectorList onConnect={() => setIsWalletConnectModalOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}