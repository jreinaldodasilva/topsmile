import React from 'react';
import './ChartHistory.css';

interface ChartVersion {
    id: string;
    chartDate: string;
    version: number;
    provider: {
        name: string;
    };
    notes?: string;
}

interface ChartHistoryProps {
    versions: ChartVersion[];
    onSelectVersion: (versionId: string) => void;
}

export const ChartHistory: React.FC<ChartHistoryProps> = ({ versions, onSelectVersion }) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="chart-history">
            <h4>Histórico de Versões</h4>
            
            {versions.length === 0 ? (
                <p className="no-history">Nenhuma versão anterior</p>
            ) : (
                <div className="history-timeline">
                    {versions.map((version, index) => (
                        <div key={version.id} className="timeline-item">
                            <div className="timeline-marker">
                                <span className="version-number">v{version.version}</span>
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <span className="timeline-date">{formatDate(version.chartDate)}</span>
                                    <button 
                                        className="view-btn"
                                        onClick={() => onSelectVersion(version.id)}
                                    >
                                        Visualizar
                                    </button>
                                </div>
                                <div className="timeline-details">
                                    <span className="provider-name">
                                        Por: {version.provider?.name || 'Desconhecido'}
                                    </span>
                                    {version.notes && (
                                        <p className="version-notes">{version.notes}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
