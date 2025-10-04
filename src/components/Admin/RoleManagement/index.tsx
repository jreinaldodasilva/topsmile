import React, { useState, useEffect } from 'react';
import { RoleAssignment } from './RoleAssignment';
import { PermissionMatrix } from './PermissionMatrix';
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
            const token = localStorage.getItem('token');
            
            const [usersRes, permissionsRes] = await Promise.all([
                fetch(`${process.env.REACT_APP_API_URL}/api/admin/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${process.env.REACT_APP_API_URL}/api/permissions/roles`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (usersRes.ok && permissionsRes.ok) {
                const usersData = await usersRes.json();
                const permissionsData = await permissionsRes.json();
                
                setUsers(usersData.data || []);
                setRolePermissions(permissionsData.data || {});
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRole = async (userId: string, role: string) => {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/role-management/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, role })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao atribuir role');
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
