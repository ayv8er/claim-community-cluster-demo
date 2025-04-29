export interface CommunityName {
  // TODO: rename to communityName after new endpoint is deployed
  clusterName: string | null;
  address: string;
}

export interface CommunityNameAvailability {
  isAvailable: boolean;
  name: string;
}

export interface CommunityNameRegistrationResponse {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface RegisterCommunityNameParams {
  address: string;
  name: string;
}

export interface WalletAccount {
  address: string | undefined;
  isConnected: boolean;
}