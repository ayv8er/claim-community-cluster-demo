'use client'

import { useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import useDebounce from "@/hooks/useDebounce";
import ClaimModalButton from "./ClaimModalButton";
import ClaimModalInput from "./ClaimModalInput";

export default function ClaimModal({ 
  setClusterName, 
  setIsWalletConnectModalOpen 
}: { 
  setClusterName: (name: string) => void, 
  setIsWalletConnectModalOpen: (open: boolean) => void 
}) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [claimName, setClaimName] = useState("");

  const debouncedClaimName = useDebounce(claimName, 500);
  const { address } = useAccount();

  const checkNameAvailability = useCallback(async (name: string) => {
    if (!name) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(`https://api.clusters.xyz/v1/names/community/${process.env.NEXT_PUBLIC_CLUSTERS_COMMUNITY_NAME}/check/${name}?testnet=true`);
      const data = await response.json();
      if (data.isAvailable) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking name availability:', error);
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkNameAvailability(debouncedClaimName);
  }, [debouncedClaimName, checkNameAvailability]);

  const handleClaimName = useCallback(async () => {
    setIsClaiming(true);
    try {
      const response = await fetch('/api/cluster/register_community_name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, name: claimName }),
      });
      const data = await response.json();
      if (data.success) {
        setClusterName(`cypherpunks/${claimName}`);
        setClaimName("");
      } else {
        console.error('Error claiming name:', data);
      }
    } catch (error) {
      console.error('Error claiming name:', error);
    } finally {
      setIsClaiming(false);
    }
  }, [address, claimName, setClusterName, setClaimName]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mt-12 md:text-4xl font-bold mb-2 md:mb-4 select-none">Join Us</h1>
      <p className="text-base text-center md:text-lg mb-6 md:mb-8 select-none">
        Claim your name and become one of us via Community Clusters
      </p>

      <div className="bg-white/5 backdrop-blur-md p-4 md:p-8 rounded-lg shadow-lg w-full max-w-[320px] md:max-w-[400px] flex flex-col gap-4 md:gap-6">
        <h2 className="text-white text-lg md:text-2xl font-bold text-gray-800 select-none">Select Community Name</h2>
        
        <div className="flex flex-col gap-3 md:gap-4">
          <ClaimModalInput 
            claimName={claimName}
            setClaimName={setClaimName}
            isChecking={isChecking}
            isAvailable={isAvailable}
          />
          
          <ClaimModalButton 
            isAvailable={isAvailable}
            isChecking={isChecking}
            isClaiming={isClaiming}
            handleClaimName={handleClaimName}
            setIsWalletConnectModalOpen={setIsWalletConnectModalOpen}
          />
        </div>
      </div>
    </div>
  );
}