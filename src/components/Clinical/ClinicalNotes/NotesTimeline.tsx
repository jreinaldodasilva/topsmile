// src/components/Clinical/ClinicalNotes/NotesTimeline.tsx
import React from 'react';
import './NotesTimeline.css';

interface Note {
    id: string;
    noteType: string;
    createdAt: string;
    provider: { name: string };
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    content?: string;
    signature?: any;
    isLocked: boolean;
}

interface NotesTimelineProps {
    notes: Note[];
    onViewNote: (noteId: string) => void;
}

export const NotesTimeline: React.FC<NotesTimelineProps> = ({ notes, onViewNote }) => {
    const getNoteTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            soap: 'SOAP',
            progress: 'Progresso',
            consultation: 'Consulta',
            procedure: 'Procedimento',
            other: 'Outro'
        };
        return labels[type] || type;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPreview = (note: Note) => {
        if (note.noteType === 'soap') {
            return note.subjective?.substring(0, 100) || 'Sem conteúdo';
        }
        return note.content?.substring(0, 100) || 'Sem conteúdo';
    };

    return (
        <div className="notes-timeline">
            {notes.length === 0 ? (
                <div className="no-notes">
                    <p>Nenhuma nota clínica registrada</p>
                </div>
            ) : (
                <div className="timeline-container">
                    {notes.map(note => (
                        <div key={note.id} className="timeline-item">
                            <div className="timeline-marker">{note.isLocked ? '🔒' : '📝'}</div>
                            <div className="timeline-content">
                                <div className="note-header">
                                    <span className="note-type">{getNoteTypeLabel(note.noteType)}</span>
                                    <span className="note-date">{formatDate(note.createdAt)}</span>
                                </div>
                                <div className="note-provider">Dr(a). {note.provider.name}</div>
                                <div className="note-preview">
                                    {getPreview(note)}
                                    {getPreview(note).length >= 100 && '...'}
                                </div>
                                <button onClick={() => onViewNote(note.id)} className="view-note-btn">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
