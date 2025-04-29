import { CommunityNameRegistrationResponse } from '../../types/cluster';

export async function clusterApiRegisterCommunityName(params: {
  name: string;
  walletAddress: string;
  communityName: string;
  apiKey: string;
  authKey: string;
}): Promise<CommunityNameRegistrationResponse> {
  const { name, walletAddress, communityName, apiKey, authKey } = params;
  
  try {
    const response = await fetch(
      `https://api.clusters.xyz/v1/names/community/${communityName}/register?testnet=true`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          "Authorization": `Bearer ${authKey}`
        },
        body: JSON.stringify({
          name,
          walletAddress
        })
      }
    );
    
    const data = await response.json();
    
    return { ...data, success: response.ok };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}