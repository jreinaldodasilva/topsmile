import React, { useState } from 'react';
import './RoleAssignment.css';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface RoleAssignmentProps {
    users: User[];
    onAssignRole: (userId: string, role: string) => Promise<void>;
}

const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'manager', label: 'Gerente' },
    { value: 'dentist', label: 'Dentista' },
    { value: 'hygienist', label: 'Higienista' },
    { value: 'receptionist', label: 'Recepcionista' },
    { value: 'lab_technician', label: 'Técnico de Laboratório' },
    { value: 'assistant', label: 'Assistente' }
];

export const RoleAssignment: React.FC<RoleAssignmentProps> = ({ users, onAssignRole }) => {
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedUser || !selectedRole) {
            setMessage({ type: 'error', text: 'Selecione um usuário e uma role' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await onAssignRole(selectedUser, selectedRole);
            setMessage({ type: 'success', text: 'Role atribuída com sucesso' });
            setSelectedUser('');
            setSelectedRole('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao atribuir role' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="role-assignment">
            <h3>Atribuir Role</h3>

            {message && <div className={`message ${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="user-select">Usuário</label>
                    <select
                        id="user-select"
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Selecione um usuário</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email}) - {user.role}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="role-select">Nova Role</label>
                    <select
                        id="role-select"
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Selecione uma role</option>
                        {roles.map(role => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Atribuindo...' : 'Atribuir Role'}
                </button>
            </form>
        </div>
    );
};
