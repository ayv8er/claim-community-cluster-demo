export interface ClusterName {
  clusterName: string | null;
  address: string;
}

export interface ClusterNameAvailability {
  isAvailable: boolean;
  name: string;
}

export interface ClusterNameRegistrationResponse {
  success: boolean;
  error?: string;
  [key: string]: any;
}

export interface RegisterNameParams {
  address: string;
  name: string;
}

export interface WalletAccount {
  address: string | undefined;
  isConnected: boolean;
}