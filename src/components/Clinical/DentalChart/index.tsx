import React, { useState, useEffect } from 'react';
import { DentalChartView } from './DentalChartView';
import { ConditionMarker } from './ConditionMarker';
import { ChartHistory } from './ChartHistory';
import { ChartAnnotations } from './ChartAnnotations';
import { ChartExport } from './ChartExport';
import { apiService } from '../../../services/apiService';
import './index.css';

interface DentalChartProps {
    patientId: string;
}

export const DentalChart: React.FC<DentalChartProps> = ({ patientId }) => {
    const [chart, setChart] = useState<any>(null);
    const [numberingSystem, setNumberingSystem] = useState<'fdi' | 'universal'>('fdi');
    const [selectedTooth, setSelectedTooth] = useState<string | undefined>();
    const [showMarker, setShowMarker] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chartHistory, setChartHistory] = useState<any[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchChart();
        fetchChartHistory();
    }, [patientId]);

    const fetchChart = async () => {
        try {
            const response = await apiService.dentalCharts.getLatest(patientId);
            if (response.success && response.data) {
                setChart(response.data);
                setNumberingSystem(response.data?.numberingSystem || 'fdi');
            } else {
                setChart({ teeth: [], numberingSystem: 'fdi' });
            }
        } catch (error) {
            console.error('Error fetching chart:', error);
            setChart({ teeth: [], numberingSystem: 'fdi' });
        } finally {
            setLoading(false);
        }
    };

    const fetchChartHistory = async () => {
        try {
            const response = await apiService.dentalCharts.getHistory(patientId);
            if (response.success && response.data) {
                setChartHistory(response.data);
            }
        } catch (error) {
            console.error('Error fetching chart history:', error);
        }
    };

    const handleSaveNotes = async (notes: string) => {
        if (!chart?.id) return;

        try {
            const response = await apiService.dentalCharts.update(chart.id, { ...chart, notes });
            if (response.success) {
                await fetchChart();
            }
        } catch (error) {
            console.error('Error saving notes:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportPDF = () => {
        alert('Funcionalidade de exportação PDF em desenvolvimento');
    };

    const handleToothSelect = (toothNumber: string) => {
        setSelectedTooth(toothNumber);
        setShowMarker(true);
    };

    const handleAddCondition = async (condition: any) => {
        try {
            const updatedTeeth = chart?.teeth || [];
            const toothIndex = updatedTeeth.findIndex((t: any) => t.toothNumber === selectedTooth);
            
            if (toothIndex >= 0) {
                updatedTeeth[toothIndex].conditions.push(condition);
            } else {
                updatedTeeth.push({
                    toothNumber: selectedTooth,
                    conditions: [condition]
                });
            }

            const payload = {
                patient: patientId,
                numberingSystem,
                teeth: updatedTeeth
            };

            const response = chart?.id
                ? await apiService.dentalCharts.update(chart.id, payload)
                : await apiService.dentalCharts.create(payload);

            if (response.success) {
                await fetchChart();
            }
        } catch (error) {
            console.error('Error saving condition:', error);
        }
    };

    if (loading) {
        return <div className="dental-chart-loading">Carregando odontograma...</div>;
    }

    return (
        <div className="dental-chart-container">
            <div className="chart-controls">
                <h2>Odontograma</h2>
                <div className="numbering-toggle">
                    <label>
                        <input
                            type="radio"
                            value="fdi"
                            checked={numberingSystem === 'fdi'}
                            onChange={(e) => setNumberingSystem(e.target.value as 'fdi')}
                        />
                        FDI
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="universal"
                            checked={numberingSystem === 'universal'}
                            onChange={(e) => setNumberingSystem(e.target.value as 'universal')}
                        />
                        Universal
                    </label>
                </div>
            </div>

            <DentalChartView
                teeth={chart?.teeth || []}
                numberingSystem={numberingSystem}
                onToothSelect={handleToothSelect}
                selectedTooth={selectedTooth}
            />

            <ChartAnnotations
                notes={chart?.notes}
                onSaveNotes={handleSaveNotes}
            />

            <ChartExport
                onPrint={handlePrint}
                onExportPDF={handleExportPDF}
            />

            <div className="history-toggle">
                <button onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? 'Ocultar' : 'Mostrar'} Histórico
                </button>
            </div>

            {showHistory && (
                <ChartHistory
                    versions={chartHistory}
                    onSelectVersion={(id) => {
                        const version = chartHistory.find(v => v.id === id);
                        if (version) setChart(version);
                    }}
                />
            )}

            {showMarker && selectedTooth && (
                <div className="marker-overlay">
                    <ConditionMarker
                        toothNumber={selectedTooth}
                        onAddCondition={handleAddCondition}
                        onClose={() => {
                            setShowMarker(false);
                            setSelectedTooth(undefined);
                        }}
                    />
                </div>
            )}
        </div>
    );
};
