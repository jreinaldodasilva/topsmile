import React from 'react';
import './PermissionMatrix.css';

interface PermissionMatrixProps {
    rolePermissions: Record<string, string[]>;
}

const permissionLabels: Record<string, string> = {
    'patients:read': 'Visualizar Pacientes',
    'patients:write': 'Editar Pacientes',
    'patients:delete': 'Excluir Pacientes',
    'appointments:read': 'Visualizar Agendamentos',
    'appointments:write': 'Editar Agendamentos',
    'appointments:delete': 'Excluir Agendamentos',
    'clinical:read': 'Visualizar Dados Clínicos',
    'clinical:write': 'Editar Dados Clínicos',
    'clinical:delete': 'Excluir Dados Clínicos',
    'prescriptions:read': 'Visualizar Prescrições',
    'prescriptions:write': 'Criar Prescrições',
    'billing:read': 'Visualizar Faturamento',
    'billing:write': 'Editar Faturamento',
    'reports:read': 'Visualizar Relatórios',
    'reports:write': 'Criar Relatórios',
    'users:read': 'Visualizar Usuários',
    'users:write': 'Editar Usuários',
    'users:delete': 'Excluir Usuários',
    'settings:read': 'Visualizar Configurações',
    'settings:write': 'Editar Configurações',
    'audit:read': 'Visualizar Auditoria'
};

const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    manager: 'Gerente',
    dentist: 'Dentista',
    hygienist: 'Higienista',
    receptionist: 'Recepcionista',
    lab_technician: 'Técnico Lab',
    assistant: 'Assistente'
};

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ rolePermissions }) => {
    const allPermissions = Array.from(new Set(Object.values(rolePermissions).flat())).sort();

    const roles = Object.keys(rolePermissions);

    return (
        <div className="permission-matrix">
            <h3>Matriz de Permissões</h3>

            <div className="matrix-container">
                <table>
                    <thead>
                        <tr>
                            <th>Permissão</th>
                            {roles.map(role => (
                                <th key={role}>{roleLabels[role] || role}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allPermissions.map(permission => (
                            <tr key={permission}>
                                <td className="permission-label">{permissionLabels[permission] || permission}</td>
                                {roles.map(role => (
                                    <td key={`${role}-${permission}`} className="permission-cell">
                                        {rolePermissions[role]?.includes(permission) ? (
                                            <span className="check">✓</span>
                                        ) : (
                                            <span className="cross">✗</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
