import { fetchCommunityName } from '../lib/api/clusters';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export const COMMUNITY_NAME_QUERY_KEY = 'communityName';

export function useCommunityNameQuery() {
  const { address } = useAccount();

  return useQuery({
    queryKey: [COMMUNITY_NAME_QUERY_KEY, address],
    queryFn: async () => {
      if (!address) return null;
      const data = await fetchCommunityName(address);
      // TODO: returned data schema dependent on new endpoint response
      return data.clusterName ?? null;
    },
    enabled: !!address,
  });
}