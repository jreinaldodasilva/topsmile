export const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
};

export const calculateAge = (dateOfBirth: string | Date | undefined): string => {
    if (!dateOfBirth) return '-';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return `${age} anos`;
};

export const getGenderLabel = (gender: string | undefined): string => {
    const labels: Record<string, string> = {
        male: 'Masculino',
        female: 'Feminino',
        other: 'Outro',
        prefer_not_to_say: 'Prefere não dizer'
    };
    return labels[gender || ''] || '-';
};
