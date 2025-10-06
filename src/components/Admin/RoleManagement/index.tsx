import React, { useState, useEffect } from 'react';
import { RoleAssignment } from './RoleAssignment';
import { PermissionMatrix } from './PermissionMatrix';
import { request } from '../../../services/http';
import './index.css';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const RoleManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, permissionsRes] = await Promise.all([
                request('/api/admin/users'),
                request('/api/permissions/roles')
            ]);

            if (usersRes.ok && usersRes.data) {
                setUsers(usersRes.data);
            }
            if (permissionsRes.ok && permissionsRes.data) {
                setRolePermissions(permissionsRes.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRole = async (userId: string, role: string) => {
        const response = await request('/api/role-management/assign', {
            method: 'POST',
            body: JSON.stringify({ userId, role })
        });

        if (!response.ok) {
            throw new Error(response.message || 'Erro ao atribuir role');
        }

        await fetchData();
    };

    if (loading) {
        return <div className="role-management-loading">Carregando...</div>;
    }

    return (
        <div className="role-management-container">
            <h2>Gerenciamento de Roles</h2>
            
            <RoleAssignment users={users} onAssignRole={handleAssignRole} />
            
            <PermissionMatrix rolePermissions={rolePermissions} />
        </div>
    );
};
