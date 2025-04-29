import { useAddressCopy } from '../hooks/useAddressCopy';
import { siteConfig } from '../config/site';

type WalletInfoProps = {
  address?: string;
  communityName?: string | null;
  onDisconnect: () => void;
};

export default function WalletInfo({ address, communityName, onDisconnect }: WalletInfoProps) {
  const { copied, copyAddress } = useAddressCopy(address);
  const clustersTestnetWebUrl = siteConfig.baseUrls.testnet;

  return (
    <div className="flex items-center gap-3 justify-between">
      <button 
        disabled={!communityName}
        onClick={() => window.open(`${clustersTestnetWebUrl}/${communityName}`, '_blank')}
        className={`bg-white/10 backdrop-blur-md rounded-lg p-2 hover:bg-white/20 transition-colors select-none ${communityName ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      >
        {communityName ? communityName : 'None'}
      </button>
      <button 
        onClick={copyAddress}
        className="bg-white/10 backdrop-blur-md rounded-lg p-2 hover:bg-white/20 cursor-pointer transition-colors select-none"
      >
        {copied ? 'Copied!' : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
      </button>
      <button 
        onClick={onDisconnect}
        className="bg-white/10 backdrop-blur-md rounded-lg p-2 hover:bg-white/20 cursor-pointer transition-colors select-none"
      >
        Disconnect
      </button>
    </div>
  );
}