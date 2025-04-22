import { clusterApiRegisterName } from '../../../../lib/server/clusters';

export async function POST(request: Request) {
  const { address, name } = await request.json();
  
  try {
    const authKey = process.env.COMMUNITY_CLUSTER_AUTH_KEY;
    if (!authKey) {
      throw new Error('COMMUNITY_CLUSTER_AUTH_KEY is not configured in environment variables.');
    }

    const communityName = process.env.NEXT_PUBLIC_CLUSTERS_COMMUNITY_NAME;
    if (!communityName) {
      throw new Error('Your COMMUNITY_NAME is required in site config.');
    }

    const result = await clusterApiRegisterName({
      name,
      walletAddress: address,
      communityName: communityName,
      apiKey: process.env.NEXT_PUBLIC_CLUSTERS_API_KEY || '',
      authKey: authKey
    });
    
    if (result.success) {
      return new Response(JSON.stringify(result), { status: 200 });
    } else {
      return new Response(JSON.stringify(result), { 
        status: 400,
        statusText: 'Failed to register name'
      });
    }
  } catch (error) {
    console.error("Error claiming cluster:", error);
    const errorMessage = error instanceof Error ? error.message : "Error claiming cluster";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }), 
      { status: 500 }
    );
  }
}