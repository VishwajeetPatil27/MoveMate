import { apiClient } from './apiClient';

export const fetchHealthStatus = async () => {
  const response = await apiClient.get('/health');
  return response.data.data;
};

