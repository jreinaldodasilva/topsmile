import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { Button, Modal, Input } from '../../components/UI';

const OperatoryManagement: React.FC = () => {
  const [operatories, setOperatories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', room: '', equipment: '', colorCode: '#3182ce', isActive: true });

  useEffect(() => {
    fetchOperatories();
  }, []);

  const fetchOperatories = async () => {
    setLoading(true);
    try {
      const result = await apiService.operatories.getAll();
      if (result.success && result.data) {
        setOperatories(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        equipment: formData.equipment.split(',').map(e => e.trim()).filter(Boolean)
      };
      const result = editing
        ? await apiService.operatories.update(editing._id, data)
        : await apiService.operatories.create(data);
      
      if (result.success) {
        await fetchOperatories();
        setShowModal(false);
        setEditing(null);
        setFormData({ name: '', room: '', equipment: '', colorCode: '#3182ce', isActive: true });
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar');
    }
  };

  const handleEdit = (op: any) => {
    setEditing(op);
    setFormData({
      name: op.name,
      room: op.room,
      equipment: op.equipment?.join(', ') || '',
      colorCode: op.colorCode || '#3182ce',
      isActive: op.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir consultório?')) return;
    try {
      await apiService.operatories.delete(id);
      await fetchOperatories();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Consultórios</h1>
        <Button onClick={() => { setEditing(null); setFormData({ name: '', room: '', equipment: '', colorCode: '#3182ce', isActive: true }); setShowModal(true); }}>
          + Novo Consultório
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {operatories.map((op) => (
          <div key={op._id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', borderRadius: '50%', background: op.colorCode || '#3182ce' }} />
            <h3>{op.name}</h3>
            <p><strong>Sala:</strong> {op.room}</p>
            <p><strong>Status:</strong> <span style={{ color: op.isActive ? '#10b981' : '#ef4444' }}>{op.isActive ? 'Ativo' : 'Inativo'}</span></p>
            {op.equipment?.length > 0 && (
              <p><strong>Equipamentos:</strong> {op.equipment.join(', ')}</p>
            )}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Button variant="outline" size="sm" onClick={() => handleEdit(op)}>Editar</Button>
              <button onClick={() => handleDelete(op._id)} style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Consultório' : 'Novo Consultório'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Input label="Nome *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Sala *" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} required />
            <Input label="Equipamentos (separados por vírgula)" value={formData.equipment} onChange={(e) => setFormData({ ...formData, equipment: e.target.value })} />
            <Input label="Cor" type="color" value={formData.colorCode} onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })} />
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} style={{ marginRight: '10px' }} />
              Ativo
            </label>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OperatoryManagement;
