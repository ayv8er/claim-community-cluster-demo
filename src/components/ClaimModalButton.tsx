import { useAccount } from "wagmi";

export default function ClaimModalButton({
  isAvailable,
  isChecking,
  isClaiming,
  handleClaimName,
  setIsWalletConnectModalOpen
}: {
  isAvailable: boolean | null;
  isChecking: boolean;
  isClaiming: boolean;
  handleClaimName: () => void;
  setIsWalletConnectModalOpen: (open: boolean) => void;
}) {
  const { address } = useAccount();

  return (
    <button 
      className={`mt-2 md:mt-4 font-bold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors select-none ${
        !address ? 'bg-white text-black hover:cursor-pointer' 
        : isAvailable && !isChecking && !isClaiming
          ? 'bg-white text-black hover:cursor-pointer'
          : 'bg-white/50 text-black/50 cursor-not-allowed'
      }`}
      onClick={address ? handleClaimName : () => setIsWalletConnectModalOpen(true)} 
      disabled={address ? (!isAvailable || isChecking || isClaiming) : false}
    >
      {isClaiming ? "Claiming..." : address ? "Claim Name" : "Connect Wallet"}
    </button>
  );
}