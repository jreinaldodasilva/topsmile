import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { ProviderScheduleForm } from '../../components/Admin/ProviderScheduleForm';
import type { Provider } from '@topsmile/types';

const ProviderDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [provider, setProvider] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        const fetchProvider = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const result = await apiService.providers.getOne(id);
                if (result.success && result.data) {
                    setProvider(result.data);
                } else {
                    setError(result.message || 'Erro ao carregar profissional');
                }
            } catch (err) {
                setError('Erro ao carregar profissional');
            } finally {
                setLoading(false);
            }
        };

        fetchProvider();
    }, [id]);

    const handleSaveSchedule = async (data: any) => {
        if (!id) return;
        try {
            const result = await apiService.providers.update(id, data);
            if (result.success && result.data) {
                setProvider(result.data);
                alert('Horários salvos com sucesso!');
            } else {
                alert(result.message || 'Erro ao salvar horários');
            }
        } catch (err: any) {
            alert(err.message || 'Erro ao salvar horários');
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;
    if (error || !provider) {
        return (
            <div style={{ padding: '20px' }}>
                <p style={{ color: 'red' }}>{error || 'Profissional não encontrado'}</p>
                <button onClick={() => navigate('/admin/providers')}>Voltar</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate('/admin/providers')} style={{ marginBottom: '10px' }}>
                    ← Voltar
                </button>
                <h1>{provider.name}</h1>
                <p style={{ color: '#666' }}>{provider.specialties?.join(', ')}</p>
            </div>

            <div style={{ borderBottom: '2px solid #e0e0e0', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('info')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderBottom: activeTab === 'info' ? '3px solid #007bff' : '3px solid transparent',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: activeTab === 'info' ? 'bold' : 'normal',
                        color: activeTab === 'info' ? '#007bff' : '#666'
                    }}
                >
                    Informações
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderBottom: activeTab === 'schedule' ? '3px solid #007bff' : '3px solid transparent',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: activeTab === 'schedule' ? 'bold' : 'normal',
                        color: activeTab === 'schedule' ? '#007bff' : '#666'
                    }}
                >
                    Horários
                </button>
            </div>

            {activeTab === 'info' && (
                <div>
                    <h2>Informações do Profissional</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <p>
                                <strong>Nome:</strong> {provider.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {provider.email || 'Não informado'}
                            </p>
                            <p>
                                <strong>Telefone:</strong> {provider.phone || 'Não informado'}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Especialidades:</strong> {provider.specialties?.join(', ') || 'Não informado'}
                            </p>
                            <p>
                                <strong>Licença:</strong> {provider.licenseNumber || 'Não informado'}
                            </p>
                            <p>
                                <strong>Status:</strong> {provider.isActive ? 'Ativo' : 'Inativo'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div>
                    <h2>Horários de Trabalho</h2>
                    <ProviderScheduleForm
                        workingHours={provider.workingHours}
                        bufferTimeBefore={provider.bufferTimeBefore}
                        bufferTimeAfter={provider.bufferTimeAfter}
                        onSave={handleSaveSchedule}
                    />
                </div>
            )}
        </div>
    );
};

export default ProviderDetail;
