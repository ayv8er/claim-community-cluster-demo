declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CLUSTERS_API_KEY?: string;
    NEXT_PUBLIC_CLUSTERS_API_BASE_URL: string;
    NEXT_PUBLIC_CLUSTERS_COMMUNITY_NAME: string;
    NEXT_PUBLIC_SEPOLIA_RPC_URL?: string;
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
    COMMUNITY_CLUSTER_AUTH_KEY: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 