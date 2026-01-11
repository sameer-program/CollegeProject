import { UserRole } from '@/lib/db/models/User';

export const rolePermissions: Record<UserRole, string[]> = {
  consultant: [
    'knowledge:create',
    'knowledge:read:own',
    'knowledge:update:own',
  ],
  validator: [
    'knowledge:read',
    'knowledge:approve',
    'knowledge:reject',
  ],
  governance: [
    'knowledge:read',
    'knowledge:authorize',
    'compliance:view',
  ],
  executive: [
    'knowledge:read',
    'analytics:view',
    'platform:metrics:view',
  ],
  controller: [
    'knowledge:*',
    'users:*',
    'platform:*',
    'ai:*',
    'system:*',
  ],
  staff: [
    'knowledge:read',
    'knowledge:create',
    'training:view',
  ],
};

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const permissions = rolePermissions[userRole] || [];
  
  // Controller has all permissions
  if (userRole === 'controller') {
    return true;
  }
  
  // Check exact permission
  if (permissions.includes(permission)) {
    return true;
  }
  
  // Check wildcard permissions (e.g., 'knowledge:*' matches 'knowledge:create')
  const wildcardPermission = permission.split(':')[0] + ':*';
  if (permissions.includes(wildcardPermission)) {
    return true;
  }
  
  return false;
}

export function canApprove(userRole: UserRole): boolean {
  return userRole === 'validator' || userRole === 'controller';
}

export function canAuthorize(userRole: UserRole): boolean {
  return userRole === 'governance' || userRole === 'controller';
}

export function canCreateKnowledge(userRole: UserRole): boolean {
  return userRole === 'consultant' || userRole === 'controller' || userRole === 'staff';
}

export function canManageUsers(userRole: UserRole): boolean {
  return userRole === 'controller';
}

