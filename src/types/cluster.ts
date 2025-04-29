export interface CommunityName {
  name: string;
  owner: string;
  totalWeiAmount: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  isTestnet: boolean;
  clusterId: string;
  expiresAt: string | null;
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