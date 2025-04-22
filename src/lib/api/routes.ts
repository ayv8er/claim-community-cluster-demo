import { RegisterNameParams, ClusterNameRegistrationResponse } from '../../types/cluster';
import { ClustersApiError } from './clusters';

export async function apiRouteRegisterName(params: RegisterNameParams): Promise<ClusterNameRegistrationResponse> {
  try {
    if (!params.address) {
      throw new ClustersApiError('Missing required address parameter', 400, params);
    }
    
    if (!params.name) {
      throw new ClustersApiError('Missing required name parameter', 400, params);
    }

    const response = await fetch('/api/cluster/register_community_name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new ClustersApiError(
        data.error || `Failed to register name: ${response.statusText}`,
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof ClustersApiError) throw error;
    
    throw new ClustersApiError(
      `Error registering name: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}