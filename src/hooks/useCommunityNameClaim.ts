import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { COMMUNITY_NAME_QUERY_KEY } from './useCommunityNameQuery';
import { ClustersApiError } from '../lib/api/clusters';
import { apiRouteRegisterCommunityName } from '../lib/api/routes';

export function useCommunityNameClaim() {
  const [isClaiming, setIsClaiming] = useState(false);
  const queryClient = useQueryClient();
  const { address } = useAccount();

  const claimName = useCallback(async (name: string): Promise<boolean> => {
    if (!address) {
      return false;
    }
    
    setIsClaiming(true);

    try {
      const response = await apiRouteRegisterCommunityName({ address, name });

      if (response.success && response.clusterName && typeof response.clusterName === 'string') {

        queryClient.setQueryData<string | null>(
          [COMMUNITY_NAME_QUERY_KEY, address],
          response.clusterName
        );

        return true;
      } else if (response.success) {
        queryClient.invalidateQueries({ queryKey: [COMMUNITY_NAME_QUERY_KEY, address] });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof ClustersApiError) {
        console.error('API error:', error.message, { status: error.status, data: error.data });
      } else {
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
  };
}