import { apiClient, ApiResponse } from './apiClient';

export interface HealthStatus {
  status: string;
  service: string;
  environment: string;
  uptimeSeconds: string;
}

export const fetchHealthStatus = async (): Promise<HealthStatus> => {
  const response = await apiClient.get<ApiResponse<HealthStatus>>('/health');
  return response.data.data;
};
