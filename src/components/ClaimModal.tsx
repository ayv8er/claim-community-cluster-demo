'use client'

import { useCallback } from "react";
import { useCommunityNameAvailability } from "../hooks/useCommunityNameAvailability";
import { useCommunityNameClaim } from "../hooks/useCommunityNameClaim";
import ClaimModalButton from "./ClaimModalButton";
import ClaimModalInput from "./ClaimModalInput";

export default function ClaimModal({ 
  setIsWalletConnectModalOpen 
}: { 
  setIsWalletConnectModalOpen: (open: boolean) => void 
}) {
  const { desiredName, setDesiredName, isAvailable, isChecking } = useCommunityNameAvailability();
  const { claimName, isClaiming } = useCommunityNameClaim();

  const handleClaimName = useCallback(async () => {
    const success = await claimName(desiredName);
    if (success) {
      setDesiredName("");
    }
  }, [desiredName, claimName, setDesiredName]);

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
            desiredName={desiredName}
            setDesiredName={setDesiredName}
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