import { Connector, useConnect } from 'wagmi';
import { useMemo, useCallback } from 'react';

export default function WalletConnectorList({ 
  onConnect 
}: { 
  onConnect: () => void 
}) {
  const { connectors, connect } = useConnect();
  
  const allowedWallets = useMemo(() => [
    'Rabby Wallet', 'MetaMask', 'WalletConnect', 'Coinbase Wallet'
  ], []);

  const handleConnect = useCallback((connector: Connector) => {
    try {
      connect({ connector });
      if (onConnect) onConnect();
    } catch (error) {
      console.error('Connection error:', error);
    }
  }, [connect, onConnect]);

  const filteredConnectors = useMemo(() => 
    connectors.filter(connector => allowedWallets.includes(connector.name)),
    [connectors, allowedWallets]
  );

  return (
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
  );
}