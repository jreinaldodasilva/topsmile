// src/components/Clinical/TreatmentPlan/ProcedureSelector.tsx
import React, { useState, useEffect } from 'react';
import './ProcedureSelector.css';

interface CDTCode {
  code: string;
  description: string;
  category: string;
  defaultCost: number;
}

interface ProcedureSelectorProps {
  onSelect: (procedure: any) => void;
  patientId: string;
}

export const ProcedureSelector: React.FC<ProcedureSelectorProps> = ({ onSelect, patientId }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [codes, setCodes] = useState<CDTCode[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredCodes, setFilteredCodes] = useState<CDTCode[]>([]);
  const [selectedCode, setSelectedCode] = useState<CDTCode | null>(null);
  const [tooth, setTooth] = useState('');
  const [surface, setSurface] = useState('');
  const [cost, setCost] = useState(0);
  const [estimating, setEstimating] = useState(false);

  useEffect(() => {
    fetch('/api/treatment-plans/cdt-codes/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data));

    fetch('/api/treatment-plans/cdt-codes/all')
      .then(res => res.json())
      .then(data => setCodes(data.data));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredCodes(codes.filter(c => c.category === selectedCategory));
    } else {
      setFilteredCodes(codes);
    }
  }, [selectedCategory, codes]);

  const handleCodeSelect = async (code: CDTCode) => {
    setSelectedCode(code);
    setCost(code.defaultCost);

    setEstimating(true);
    try {
      const res = await fetch('/api/treatment-plans/estimate-insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          procedures: [{ code: code.code, cost: code.defaultCost }]
        })
      });
      const data = await res.json();
      if (data.success && data.data[0]) {
        setCost(data.data[0].cost);
      }
    } catch (error) {
      console.error('Error estimating insurance:', error);
    } finally {
      setEstimating(false);
    }
  };

  const handleAdd = () => {
    if (!selectedCode) return;

    onSelect({
      code: selectedCode.code,
      description: selectedCode.description,
      tooth: tooth || undefined,
      surface: surface || undefined,
      cost
    });

    setSelectedCode(null);
    setTooth('');
    setSurface('');
    setCost(0);
  };

  return (
    <div className="procedure-selector">
      <div className="selector-row">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Todas as Categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedCode?.code || ''}
          onChange={(e) => {
            const code = filteredCodes.find(c => c.code === e.target.value);
            if (code) handleCodeSelect(code);
          }}
          className="code-select"
        >
          <option value="">Selecione um Procedimento</option>
          {filteredCodes.map(code => (
            <option key={code.code} value={code.code}>
              {code.code} - {code.description}
            </option>
          ))}
        </select>
      </div>

      {selectedCode && (
        <div className="procedure-details">
          <input
            type="text"
            placeholder="Dente (opcional)"
            value={tooth}
            onChange={(e) => setTooth(e.target.value)}
            className="tooth-input"
          />
          <input
            type="text"
            placeholder="Superfície (opcional)"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            className="surface-input"
          />
          <input
            type="number"
            placeholder="Custo"
            value={cost}
            onChange={(e) => setCost(parseFloat(e.target.value))}
            className="cost-input"
            disabled={estimating}
          />
          <button onClick={handleAdd} className="add-procedure-btn">
            Adicionar
          </button>
        </div>
      )}
    </div>
  );
};
