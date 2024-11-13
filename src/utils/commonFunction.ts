import apiClient  from './apiClient';
import { Method } from 'axios';
// import { PERMISSIONS } from "./constants";



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




const PERMISSIONS = {
  VIEW: 'perm_view',
  ADD: 'perm_add',
  UPDATE: 'perm_edit',
  DELETE: 'perm_delete'
};

// Utility function to check permissions
export const hasPermission = (permissions, moduleAlias, action) => {
  // Mapping the action to the appropriate permission field in the permission object
  const permissionFieldMap = {
    [PERMISSIONS.VIEW]: 'perm_view',
    [PERMISSIONS.ADD]: 'perm_add',
    [PERMISSIONS.UPDATE]: 'perm_edit',
    [PERMISSIONS.DELETE]: 'perm_delete',
  };

  // Check if the action provided is valid
  if (!permissionFieldMap[action]) {
    console.error(`Invalid action provided: ${action}`);
    return false;
  }

  // Get the corresponding permission field for the action
  const permissionField = permissionFieldMap[action];

  // Find the permissions for the specified module
  const modulePermissions = permissions.find(
    (perm) => perm.module.alias === moduleAlias
  );

  if (!modulePermissions) {
    console.warn(`No permissions found for module alias: ${moduleAlias}`);
    return false;
  }

  // Check if the permission for the specified action is granted
  const isAllowed = modulePermissions[permissionField] === 1;
  console.log(`Permission for ${action} on ${moduleAlias}:`, isAllowed);
  return isAllowed;
};