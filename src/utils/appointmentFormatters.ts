export const formatDateTime = (dateString?: string | Date): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatTime = (dateString?: string | Date): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getStatusLabel = (status?: string): string => {
    const labels: Record<string, string> = {
        scheduled: 'Agendado',
        confirmed: 'Confirmado',
        checked_in: 'Check-in',
        in_progress: 'Em andamento',
        completed: 'Concluído',
        cancelled: 'Cancelado',
        no_show: 'Faltou'
    };
    return labels[status || ''] || status || '';
};

export const getStatusColor = (status?: string): string => {
    const colors: Record<string, string> = {
        scheduled: '#6b7280',
        confirmed: '#3b82f6',
        checked_in: '#f59e0b',
        in_progress: '#10b981',
        completed: '#059669',
        cancelled: '#dc2626',
        no_show: '#991b1b'
    };
    return colors[status || ''] || '#6b7280';
};

export const getPriorityLabel = (priority?: string): string => {
    const labels: Record<string, string> = {
        routine: 'Rotina',
        urgent: 'Urgente',
        emergency: 'Emergência'
    };
    return labels[priority || ''] || priority || '';
};
