/**
 * Admin Access Utilities
 * 
 * This file provides easy ways to enable admin access for testing and development.
 * Use these functions in the browser console to quickly access the admin panel.
 */

export const enableAdminAccess = () => {
  localStorage.setItem('fynda-admin', 'true');
  console.log('✅ Admin access enabled! You can now access /admin');
  console.log('🔄 Please refresh the page to see the changes');
  return true;
};

export const disableAdminAccess = () => {
  localStorage.removeItem('fynda-admin');
  localStorage.removeItem('admin_token');
  console.log('❌ Admin access disabled! You will be redirected to login');
  console.log('🔄 Please refresh the page to see the changes');
  return true;
};

export const checkAdminStatus = () => {
  const adminFlag = localStorage.getItem('fynda-admin');
  const adminToken = localStorage.getItem('admin_token');
  
  console.log('🔍 Admin Access Status:');
  console.log('  - localStorage flag:', adminFlag);
  console.log('  - Admin token:', adminToken ? 'Present' : 'Not present');
  console.log('  - Environment mode:', import.meta.env.VITE_ADMIN_MODE);
  
  return {
    hasFlag: adminFlag === 'true',
    hasToken: !!adminToken,
    envMode: import.meta.env.VITE_ADMIN_MODE === 'true'
  };
};

export const quickAdminSetup = () => {
  console.log('🚀 Quick Admin Setup');
  console.log('==================');
  console.log('1. Enabling admin access...');
  enableAdminAccess();
  console.log('2. Admin access enabled!');
  console.log('3. Navigate to: http://localhost:8082/admin');
  console.log('4. You should now have full access to the admin panel');
  console.log('');
  console.log('Available admin features:');
  console.log('  - Dashboard: Overview and stats');
  console.log('  - Analytics: Charts and detailed metrics');
  console.log('  - Waitlist Management: View and manage all signups');
  console.log('  - Content Management: Edit website content');
  console.log('  - Site Settings: Configure site-wide settings');
  console.log('  - User Management: Manage admin users');
  console.log('  - Coming Soon Mode: Toggle website visibility');
  console.log('');
  console.log('To disable admin access, run: disableAdminAccess()');
};

// Make functions available globally for easy access
if (typeof window !== 'undefined') {
  (window as any).enableAdminAccess = enableAdminAccess;
  (window as any).disableAdminAccess = disableAdminAccess;
  (window as any).checkAdminStatus = checkAdminStatus;
  (window as any).quickAdminSetup = quickAdminSetup;
  
  console.log('🔧 Admin utilities loaded! Available commands:');
  console.log('  - enableAdminAccess()');
  console.log('  - disableAdminAccess()');
  console.log('  - checkAdminStatus()');
  console.log('  - quickAdminSetup()');
}
