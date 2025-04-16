import { useCallback } from "react";

export default function ClaimModalInput({
  claimName,
  setClaimName,
  isChecking,
  isAvailable
}: {
  claimName: string;
  setClaimName: (name: string) => void;
  isChecking: boolean;
  isAvailable: boolean | null;
}) {

  const getAvailabilityMessage = useCallback(() => {
    if (!claimName) return null;
    if (isChecking) return "Checking availability...";
    if (isAvailable === null) return null;
    return isAvailable ? "✓ Name is available" : "✗ Name is already taken";
  }, [claimName, isChecking, isAvailable]);

  const getAvailabilityColor = useCallback(() => {
    if (!claimName || isChecking || isAvailable === null) return "text-white/50";
    return isAvailable ? "text-green-400" : "text-red-400";
  }, [claimName, isChecking, isAvailable]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 md:px-4 py-2">
        <span className="text-white/90 text-base md:text-lg font-bold select-none">notwrjo/</span>
        <input
          type="text"
          value={claimName}
          placeholder="your name"
          onChange={(e) => setClaimName(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-white placeholder:text-white/50 w-full"
        />
      </div>
      <div className="h-6 flex items-center select-none">
        <span className={`text-xs md:text-sm ${getAvailabilityColor()}`}>
          {getAvailabilityMessage() || "\u00A0"}
        </span>
      </div>
    </div>
  );
}