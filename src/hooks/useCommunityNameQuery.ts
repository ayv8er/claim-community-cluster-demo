import { fetchCommunityName } from '../lib/api/clusters';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { CommunityName } from '../types/cluster';

export const COMMUNITY_NAME_QUERY_KEY = 'communityName';

export function useCommunityNameQuery() {
  const { address } = useAccount();

  return useQuery({
    queryKey: [COMMUNITY_NAME_QUERY_KEY, address],
    queryFn: async () => {
      if (!address) return null;
      const data: CommunityName[] = await fetchCommunityName(address);
      const communityMember = data.find(member => member.name.startsWith(`${process.env.NEXT_PUBLIC_CLUSTERS_COMMUNITY_NAME}/`));
      return communityMember?.name ?? null;
    },
    enabled: !!address,
  });
}