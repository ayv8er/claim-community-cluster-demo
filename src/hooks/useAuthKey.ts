import { useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { getSigningMessage, getAuthToken } from "../lib/api/clusters";

export default function useAuthKey() {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  
  const getAuthKey = useCallback(async () => {
    if (!address) throw new Error('No address found');

    try {
      const messageData = await getSigningMessage();

      const signature = await signMessageAsync({ message: messageData.message });

      const tokenData = await getAuthToken({
        signature: signature,
        signingDate: messageData.signingDate,
        wallet: address,
      });

      return tokenData.token;
    } catch (error) {
      console.error("Error getting auth key:", error);
      return null;
    }
  }, [address, signMessageAsync]);

  return { getAuthKey };
}
