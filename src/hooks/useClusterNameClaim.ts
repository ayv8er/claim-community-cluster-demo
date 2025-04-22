import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { CLUSTER_NAME_QUERY_KEY } from './useClusterNameQuery';
import { ClustersApiError } from '../lib/api/clusters';
import { apiRouteRegisterName } from '../lib/api/routes';

export function useClusterNameClaim() {
  const [error, setError] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const queryClient = useQueryClient();
  const { address } = useAccount();

  const claimName = useCallback(async (name: string) => {
    if (!address) {
      setError('Wallet address is required');
      return false;
    }

    if (!name) {
      setError('Name is required');
      return false;
    }
    
    setIsClaiming(true);
    setError(null);

    try {
      const response = await apiRouteRegisterName({ address, name });

      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [CLUSTER_NAME_QUERY_KEY, address] });
        return true;
      } else {
        setError(response.error || 'Failed to claim community name');
        return false;
      }
    } catch (error) {
      if (error instanceof ClustersApiError) {
        setError(error.message);
        console.error('API error:', error.message, { status: error.status, data: error.data });
      } else {
        setError('An unexpected error occurred');
        console.error('Error claiming name:', error);
      }
      return false;
    } finally {
      setIsClaiming(false);
    }
  }, [address, queryClient]);

  return {
    claimName,
    isClaiming,
    error
  };
}