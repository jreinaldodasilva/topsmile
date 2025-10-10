import React, { useState } from 'react';
import { Tooth } from './Tooth';
import './DentalChartView.css';

interface ToothData {
    toothNumber: string;
    conditions: Array<{
        type: string;
        status: string;
        surface?: string;
        notes?: string;
    }>;
}

interface DentalChartViewProps {
    teeth: ToothData[];
    numberingSystem: 'fdi' | 'universal';
    onToothSelect: (toothNumber: string) => void;
    selectedTooth?: string;
}

const FDI_UPPER = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
const FDI_LOWER = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];

const UNIVERSAL_UPPER = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
const UNIVERSAL_LOWER = [
    '32',
    '31',
    '30',
    '29',
    '28',
    '27',
    '26',
    '25',
    '24',
    '23',
    '22',
    '21',
    '20',
    '19',
    '18',
    '17'
];

export const DentalChartView: React.FC<DentalChartViewProps> = ({
    teeth,
    numberingSystem,
    onToothSelect,
    selectedTooth
}) => {
    const upperTeeth = numberingSystem === 'fdi' ? FDI_UPPER : UNIVERSAL_UPPER;
    const lowerTeeth = numberingSystem === 'fdi' ? FDI_LOWER : UNIVERSAL_LOWER;

    const getToothData = (toothNumber: string): ToothData => {
        return (
            teeth.find(t => t.toothNumber === toothNumber) || {
                toothNumber,
                conditions: []
            }
        );
    };

    return (
        <div className="dental-chart-view">
            <div className="chart-header">
                <h3>Odontograma - {numberingSystem === 'fdi' ? 'FDI' : 'Universal'}</h3>
            </div>

            <svg width="600" height="200" viewBox="0 0 600 200">
                {/* Upper teeth */}
                <g>
                    <text x="10" y="30" fontSize="14" fill="#666">
                        Superior
                    </text>
                    {upperTeeth.map((number, index) => {
                        const toothData = getToothData(number);
                        return (
                            <Tooth
                                key={number}
                                number={number}
                                x={50 + index * 35}
                                y={10}
                                conditions={toothData.conditions}
                                selected={selectedTooth === number}
                                onClick={onToothSelect}
                            />
                        );
                    })}
                </g>

                {/* Lower teeth */}
                <g>
                    <text x="10" y="130" fontSize="14" fill="#666">
                        Inferior
                    </text>
                    {lowerTeeth.map((number, index) => {
                        const toothData = getToothData(number);
                        return (
                            <Tooth
                                key={number}
                                number={number}
                                x={50 + index * 35}
                                y={110}
                                conditions={toothData.conditions}
                                selected={selectedTooth === number}
                                onClick={onToothSelect}
                            />
                        );
                    })}
                </g>
            </svg>

            <div className="chart-legend">
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#ffffff' }}></span>
                    <span>Normal</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#ffcccc' }}></span>
                    <span>Condição Existente</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ background: '#ffffcc' }}></span>
                    <span>Tratamento Planejado</span>
                </div>
            </div>
        </div>
    );
};
