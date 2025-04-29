import { CommunityName, CommunityNameAvailability, CommunityNameRegistrationResponse } from '../../types/cluster';

const BASE_URL = process.env.NEXT_PUBLIC_CLUSTERS_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_CLUSTERS_API_KEY || '';
const COMMUNITY_NAME = process.env.NEXT_PUBLIC_CLUSTERS_COMMUNITY_NAME;

if (!BASE_URL) {
  throw new Error("Configuration Error: NEXT_PUBLIC_CLUSTERS_API_BASE_URL is not defined in environment variables.");
}
if (!COMMUNITY_NAME) {
  throw new Error("Configuration Error: NEXT_PUBLIC_CLUSTERS_COMMUNITY_NAME is not defined in environment variables.");
}

export class ClustersApiError extends Error {
  status?: number;
  data?: unknown;
  
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ClustersApiError';
    this.status = status;
    this.data = data;
  }
}

export async function getSigningMessage() {
  try {
    const response = await fetch(`${BASE_URL}/v1/auth/message`);

    if (!response.ok) {
      throw new ClustersApiError(
        'Failed to get signing message', response.status, await response.json()
      );
    }

    const data = await response.json();

    if (!data.message || !data.signingDate) {
      throw new ClustersApiError(
        'Invalid response from getSigningMessage', response.status, data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ClustersApiError) throw error;

    throw new ClustersApiError(
      `Network error when fetching signing message: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function getAuthToken(params: {
  signature: string; 
  signingDate: string;
  wallet: string;
}) {
  try {
    if (!params.signature || !params.signingDate || !params.wallet) {
      throw new ClustersApiError(
        'Missing required parameters', 400, params
      );
    }

    const response = await fetch(`${BASE_URL}/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        ...params,
        type: 'evm',
      }),
    });

    if (!response.ok) {
      throw new ClustersApiError(
        'Failed to get auth token', response.status, await response.json()
      );
    }

    const data = await response.json();

    if (!data.token) {
      throw new ClustersApiError(
        'Invalid response from getAuthToken', response.status, data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ClustersApiError) throw error;

    throw new ClustersApiError(
      `Network error when fetching auth token: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function fetchCommunityName(address: string): Promise<CommunityName> {
  // TODO: replace with new endpoint
  const response = await fetch(`${BASE_URL}/v1/names/address/${address}?testnet=true`);

  if (!response.ok) { 
    throw new Error('Failed to get community name');
  }

  return response.json();
}

export async function checkNameAvailability(name: string): Promise<CommunityNameAvailability> {
  try {
    if (!name) {
      throw new ClustersApiError(
        'Missing required name parameter', 400, { name }
      );
    }

    const response = await fetch(
      `${BASE_URL}/v1/names/community/${COMMUNITY_NAME}/check/${name}?testnet=true`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new ClustersApiError(
        'Failed to check name availability', response.status, await response.json()
      );
    }

    const data = await response.json();

    if (typeof data.isAvailable !== 'boolean') {
      throw new ClustersApiError(
        'Invalid response from checkNameAvailability', response.status, data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ClustersApiError) throw error;

    throw new ClustersApiError(
      `Network error when checking name availability: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function registerCommunityName(params: {
  address: string;
  name: string;
}): Promise<CommunityNameRegistrationResponse> {
  try {
    if (!params.address) {
      throw new ClustersApiError(
        'Missing required address parameter', 400, params
      );
    }

    if (!params.name) {
      throw new ClustersApiError(
        'Missing required name parameter', 400, params
      );
    }

    const response = await fetch('/api/cluster/register_community_name', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ClustersApiError(
        `Failed to register community name: ${response.statusText}`,
        response.status,
        errorData
      );
    }
    
    const data = await response.json();
    
    if (typeof data.success !== 'boolean') {
      throw new ClustersApiError(
        'Invalid response: missing success field',
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof ClustersApiError) throw error;
    
    throw new ClustersApiError(
      `Network error when registering community name: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}