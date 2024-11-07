import apiClient  from './apiClient';
import { Method } from 'axios';



// export const getBanksWithAccessToken = async () => {
//   console.log('Fetching banks with access token...');
//   try {
//     const data = await apiRequest('GET', '/api/banks');
//     console.log('Banks fetched successfully:', data);
//     return data;
//   } catch (error) {
//     console.log('Error fetching banks:', error);
//     throw new Error('Error fetching banks');
//   }
// };

export const apiRequest = async (method: Method, url: string, data: any = {}) => {
    try {
      const response = await apiClient({
        method,
        url,
        data,
      });
      console.log(`API ${method} request to ${url} successful:`, response.data);
      return response.data;
    } catch (error) {
      console.log(`API ${method} request to ${url} failed:`, error);
      throw error;
    }
  };

