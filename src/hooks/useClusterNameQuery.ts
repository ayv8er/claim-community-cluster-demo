import { fetchClusterName } from '../lib/api/clusters';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export const CLUSTER_NAME_QUERY_KEY = 'clusterName';

export function useClusterNameQuery() {
  const { address } = useAccount();

  return useQuery({
    queryKey: [CLUSTER_NAME_QUERY_KEY, address],
    queryFn: async () => {
      if (!address) return null;
      const data = await fetchClusterName(address);
      return data.clusterName ?? null;
    },
    enabled: !!address,
  });
}