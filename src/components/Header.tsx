'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Header({
  isWalletConnectModalOpen,
  setIsWalletConnectModalOpen,
  clusterName,
  setClusterName
}: {
  isWalletConnectModalOpen: boolean;
  setIsWalletConnectModalOpen: (isOpen: boolean) => void;
  clusterName: string;
  setClusterName: (clusterName: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const copyAddress = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected) {
      setIsWalletConnectModalOpen(true);
    }
  }, [isConnected, setIsWalletConnectModalOpen]);

  const allowedWallets = useMemo(() => ['Rabby Wallet', 'MetaMask', 'WalletConnect', 'Coinbase Wallet'], []);

  const handleConnect = useCallback((connector: Connector) => {
    try {
      connect({ connector });
    } catch (error) {
      console.error('Connection error:', error);
    }
  }, [connect]);

  const handleDisconnect = useCallback(() => {
    try {
      setIsWalletConnectModalOpen(false);
      setClusterName('');
      disconnect();
    } catch (error) {
      console.error('Disconnection error:', error);
    }
  }, [disconnect, setIsWalletConnectModalOpen, setClusterName]);

  const filteredConnectors = useMemo(() => 
    connectors.filter(connector => allowedWallets.includes(connector.name)),
    [connectors, allowedWallets, handleConnect]
  );

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
            <div className="flex items-center gap-3">
              <div 
                onClick={() => window.open(`https://testnet.clusters.xyz/${clusterName}`, '_blank')}
                className="bg-white/10 backdrop-blur-md rounded-lg p-2 hover:bg-white/20 cursor-pointer transition-colors select-none"
              >
                {clusterName}
              </div>
              <button 
                onClick={copyAddress}
                className="bg-white/10 backdrop-blur-md rounded-lg p-2 hover:bg-white/20 cursor-pointer transition-colors select-none"
              >
                {copied ? 'Copied!' : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
              </button>
              <button 
                onClick={handleDisconnect}
                className="bg-white/10 backdrop-blur-md rounded-lg p-2 hover:bg-white/20 cursor-pointer transition-colors select-none"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
              {filteredConnectors.map((connector: Connector) => (
                <button 
                  key={connector.uid} 
                    onClick={() => handleConnect(connector)}
                    className="bg-white/10 backdrop-blur-md rounded-lg p-2 hover:bg-white/20 cursor-pointer transition-colors w-full md:w-auto md:min-w-[160px] lg:min-w-0 whitespace-nowrap"
                  >
                    {connector.name}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}