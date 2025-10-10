import React from 'react';
import './ChartExport.css';

interface ChartExportProps {
    onPrint: () => void;
    onExportPDF: () => void;
}

export const ChartExport: React.FC<ChartExportProps> = ({ onPrint, onExportPDF }) => {
    return (
        <div className="chart-export">
            <h4>Exportar Odontograma</h4>

            <div className="export-options">
                <button className="export-btn print-btn" onClick={onPrint}>
                    <span className="btn-icon">🖨️</span>
                    Imprimir
                </button>

                <button className="export-btn pdf-btn" onClick={onExportPDF}>
                    <span className="btn-icon">📄</span>
                    Exportar PDF
                </button>
            </div>
        </div>
    );
};
