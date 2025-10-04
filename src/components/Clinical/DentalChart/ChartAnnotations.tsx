import React, { useState } from 'react';
import './ChartAnnotations.css';

interface ChartAnnotationsProps {
    notes?: string;
    onSaveNotes: (notes: string) => void;
}

export const ChartAnnotations: React.FC<ChartAnnotationsProps> = ({ notes = '', onSaveNotes }) => {
    const [editMode, setEditMode] = useState(false);
    const [currentNotes, setCurrentNotes] = useState(notes);

    const handleSave = () => {
        onSaveNotes(currentNotes);
        setEditMode(false);
    };

    const handleCancel = () => {
        setCurrentNotes(notes);
        setEditMode(false);
    };

    return (
        <div className="chart-annotations">
            <div className="annotations-header">
                <h4>Anotações do Odontograma</h4>
                {!editMode && (
                    <button className="edit-btn" onClick={() => setEditMode(true)}>
                        Editar
                    </button>
                )}
            </div>

            {editMode ? (
                <div className="annotations-edit">
                    <textarea
                        value={currentNotes}
                        onChange={(e) => setCurrentNotes(e.target.value)}
                        placeholder="Adicione observações gerais sobre o odontograma..."
                        rows={6}
                    />
                    <div className="edit-actions">
                        <button className="cancel-btn" onClick={handleCancel}>
                            Cancelar
                        </button>
                        <button className="save-btn" onClick={handleSave}>
                            Salvar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="annotations-view">
                    {notes ? (
                        <p>{notes}</p>
                    ) : (
                        <p className="no-notes">Nenhuma anotação adicionada</p>
                    )}
                </div>
            )}
        </div>
    );
};
