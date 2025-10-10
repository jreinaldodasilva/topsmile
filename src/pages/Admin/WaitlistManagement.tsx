import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { Button, Modal, Input, SimpleSelect } from '../../components/UI';

const WaitlistManagement: React.FC = () => {
    const [waitlist, setWaitlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        patient: '',
        appointmentType: '',
        priority: 'routine' as 'routine' | 'urgent' | 'emergency',
        preferredDates: '',
        preferredTimes: '',
        notes: ''
    });

    useEffect(() => {
        fetchWaitlist();
        fetchPatients();
    }, []);

    const fetchWaitlist = async () => {
        setLoading(true);
        try {
            const result = await apiService.waitlist.getAll({ status: 'active' });
            if (result.success && result.data) {
                setWaitlist(result.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        const result = await apiService.patients.getAll({ limit: 100 });
        if (result.success && result.data) {
            setPatients(Array.isArray(result.data) ? result.data : []);
        }
    };

    const handleSave = async () => {
        try {
            const data = {
                ...formData,
                preferredDates: formData.preferredDates
                    .split(',')
                    .map(d => d.trim())
                    .filter(Boolean),
                preferredTimes: formData.preferredTimes
                    .split(',')
                    .map(t => t.trim())
                    .filter(Boolean)
            };
            const result = await apiService.waitlist.create(data);
            if (result.success) {
                await fetchWaitlist();
                setShowModal(false);
                setFormData({
                    patient: '',
                    appointmentType: '',
                    priority: 'routine',
                    preferredDates: '',
                    preferredTimes: '',
                    notes: ''
                });
            }
        } catch (err: any) {
            alert(err.message || 'Erro ao salvar');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Remover da lista de espera?')) return;
        try {
            await apiService.waitlist.delete(id);
            await fetchWaitlist();
        } catch (err: any) {
            alert(err.message || 'Erro ao remover');
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'emergency':
                return '#ef4444';
            case 'urgent':
                return '#f59e0b';
            default:
                return '#10b981';
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>Lista de Espera</h1>
                <Button onClick={() => setShowModal(true)}>+ Adicionar à Lista</Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {waitlist.length === 0 ? (
                    <p style={{ color: '#666' }}>Nenhum paciente na lista de espera.</p>
                ) : (
                    waitlist.map(item => (
                        <div
                            key={item._id}
                            style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}
                                >
                                    <h3 style={{ margin: 0 }}>{item.patient?.fullName || item.patient?.firstName}</h3>
                                    <span
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            background: getPriorityColor(item.priority),
                                            color: 'white'
                                        }}
                                    >
                                        {item.priority === 'emergency'
                                            ? 'Emergência'
                                            : item.priority === 'urgent'
                                              ? 'Urgente'
                                              : 'Rotina'}
                                    </span>
                                </div>
                                <p>
                                    <strong>Tipo:</strong> {item.appointmentType?.name || 'N/A'}
                                </p>
                                <p>
                                    <strong>Datas Preferidas:</strong>{' '}
                                    {item.preferredDates
                                        ?.map((d: any) => new Date(d).toLocaleDateString('pt-BR'))
                                        .join(', ') || 'Qualquer'}
                                </p>
                                <p>
                                    <strong>Horários:</strong> {item.preferredTimes?.join(', ') || 'Qualquer'}
                                </p>
                                {item.notes && (
                                    <p>
                                        <strong>Obs:</strong> {item.notes}
                                    </p>
                                )}
                                <p style={{ color: '#666', fontSize: '14px' }}>
                                    Adicionado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button variant="outline" size="sm">
                                    Agendar
                                </Button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    style={{
                                        padding: '5px 10px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Adicionar à Lista de Espera">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <SimpleSelect
                            label="Paciente *"
                            value={formData.patient}
                            onChange={e => setFormData({ ...formData, patient: e.target.value })}
                            required
                        >
                            <option value="">Selecione</option>
                            {patients.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.fullName || `${p.firstName} ${p.lastName}`}
                                </option>
                            ))}
                        </SimpleSelect>
                        <SimpleSelect
                            label="Prioridade *"
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                            required
                        >
                            <option value="routine">Rotina</option>
                            <option value="urgent">Urgente</option>
                            <option value="emergency">Emergência</option>
                        </SimpleSelect>
                        <Input
                            label="Datas Preferidas (separadas por vírgula)"
                            value={formData.preferredDates}
                            onChange={e => setFormData({ ...formData, preferredDates: e.target.value })}
                            placeholder="2025-02-01, 2025-02-05"
                        />
                        <Input
                            label="Horários Preferidos (separados por vírgula)"
                            value={formData.preferredTimes}
                            onChange={e => setFormData({ ...formData, preferredTimes: e.target.value })}
                            placeholder="09:00, 14:00"
                        />
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Observações..."
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <Button variant="outline" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave}>Adicionar</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default WaitlistManagement;
