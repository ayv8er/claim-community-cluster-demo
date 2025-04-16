export async function POST(request: Request) {
  const { address, name } = await request.json();
  try {
    const response = await fetch(`https://api.clusters.xyz/v1/names/community/cypherpunks/register?testnet=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_CLUSTERS_API_KEY || "",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CYPHERPUNKS_COMMUNITY_CLUSTER_AUTH_KEY}`
      },
      body: JSON.stringify({
        name,
        walletAddress: address
      })
    })
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      return new Response(JSON.stringify({ ...data, success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ ...data, success: false }), { status: 400 });
    }
  } catch (error) {
    console.error("Error claiming cluster:", error);
    return new Response(JSON.stringify({ success: false, error: "Error claiming cluster" }), { status: 500 });
  }
};