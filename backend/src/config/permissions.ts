// backend/src/config/permissions.ts
export type Permission = 
    | 'patients:read' | 'patients:write' | 'patients:delete'
    | 'appointments:read' | 'appointments:write' | 'appointments:delete'
    | 'clinical:read' | 'clinical:write' | 'clinical:delete'
    | 'prescriptions:read' | 'prescriptions:write'
    | 'billing:read' | 'billing:write'
    | 'reports:read' | 'reports:write'
    | 'users:read' | 'users:write' | 'users:delete'
    | 'settings:read' | 'settings:write'
    | 'audit:read';

export const rolePermissions: Record<string, Permission[]> = {
    super_admin: [
        'patients:read', 'patients:write', 'patients:delete',
        'appointments:read', 'appointments:write', 'appointments:delete',
        'clinical:read', 'clinical:write', 'clinical:delete',
        'prescriptions:read', 'prescriptions:write',
        'billing:read', 'billing:write',
        'reports:read', 'reports:write',
        'users:read', 'users:write', 'users:delete',
        'settings:read', 'settings:write',
        'audit:read'
    ],
    admin: [
        'patients:read', 'patients:write', 'patients:delete',
        'appointments:read', 'appointments:write', 'appointments:delete',
        'clinical:read', 'clinical:write',
        'prescriptions:read', 'prescriptions:write',
        'billing:read', 'billing:write',
        'reports:read', 'reports:write',
        'users:read', 'users:write',
        'settings:read', 'settings:write',
        'audit:read'
    ],
    manager: [
        'patients:read', 'patients:write',
        'appointments:read', 'appointments:write',
        'clinical:read',
        'billing:read', 'billing:write',
        'reports:read',
        'users:read'
    ],
    dentist: [
        'patients:read', 'patients:write',
        'appointments:read', 'appointments:write',
        'clinical:read', 'clinical:write',
        'prescriptions:read', 'prescriptions:write',
        'reports:read'
    ],
    hygienist: [
        'patients:read',
        'appointments:read', 'appointments:write',
        'clinical:read', 'clinical:write'
    ],
    receptionist: [
        'patients:read', 'patients:write',
        'appointments:read', 'appointments:write',
        'billing:read'
    ],
    lab_technician: [
        'patients:read',
        'appointments:read',
        'clinical:read'
    ],
    assistant: [
        'patients:read',
        'appointments:read',
        'clinical:read'
    ]
};

export const hasPermission = (role: string, permission: Permission): boolean => {
    const permissions = rolePermissions[role] || [];
    return permissions.includes(permission);
};

export const hasAnyPermission = (role: string, permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(role, permission));
};

export const hasAllPermissions = (role: string, permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(role, permission));
};
