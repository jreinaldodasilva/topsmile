// src/features/clinical/components/DentalChartExample.tsx
import React, { useEffect } from 'react';
import { useDentalChart } from '../hooks';
import { useClinicalStore } from '../../../store';

interface DentalChartExampleProps {
    patientId: string;
}

const DentalChartExample: React.FC<DentalChartExampleProps> = ({ patientId }) => {
    const { chart, loading, error, getLatest } = useDentalChart();
    const { selectedTooth, setSelectedTooth, chartMode } = useClinicalStore();

    useEffect(() => {
        if (patientId) {
            getLatest(patientId);
        }
    }, [patientId, getLatest]);

    const handleToothClick = (toothNumber: string) => {
        if (chartMode === 'edit') {
            setSelectedTooth(toothNumber);
        }
    };

    if (loading) return <div>Carregando odontograma...</div>;
    if (error) return <div>Erro: {error}</div>;
    if (!chart) return <div>Nenhum odontograma encontrado</div>;

    return (
        <div className="dental-chart">
            <div className="dental-chart-header">
                <h3>Odontograma</h3>
                <span>Modo: {chartMode === 'edit' ? 'Edição' : 'Visualização'}</span>
            </div>
            <div className="dental-chart-grid">
                {chart.teeth?.map((tooth: any) => (
                    <div
                        key={tooth.number}
                        className={`tooth ${selectedTooth === tooth.number ? 'selected' : ''}`}
                        onClick={() => handleToothClick(tooth.number)}
                    >
                        {tooth.number}
                    </div>
                ))}
            </div>
            {selectedTooth && (
                <div className="tooth-details">
                    Dente selecionado: {selectedTooth}
                </div>
            )}
        </div>
    );
};

export default DentalChartExample;
