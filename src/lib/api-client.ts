import { AdminData } from '@/types/auth';
import { logAuth, logSecurity, logger } from '@/utils/logger';
import { 
  authenticateAdmin, 
  getAdminData, 
  isAdminAuthenticated, 
  logoutAdmin, 
  getAdminToken, 
  validateAdminToken 
} from '@/services/admin-api';

// Re-export admin functions for backward compatibility
export {
  authenticateAdmin,
  getAdminData,
  isAdminAuthenticated,
  logoutAdmin,
  getAdminToken,
  validateAdminToken
};
