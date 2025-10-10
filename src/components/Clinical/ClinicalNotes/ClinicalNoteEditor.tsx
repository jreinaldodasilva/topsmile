// src/components/Clinical/ClinicalNotes/ClinicalNoteEditor.tsx
import React, { useState, useEffect } from 'react';
import { TemplateSelector } from './TemplateSelector';
import { SignaturePad } from './SignaturePad';
import './ClinicalNoteEditor.css';

interface ClinicalNoteEditorProps {
    patientId: string;
    providerId: string;
    appointmentId?: string;
    onSave: (note: any) => void;
    initialData?: any;
}

export const ClinicalNoteEditor: React.FC<ClinicalNoteEditorProps> = ({
    patientId,
    providerId,
    appointmentId,
    onSave,
    initialData
}) => {
    const [noteType, setNoteType] = useState(initialData?.noteType || 'soap');
    const [subjective, setSubjective] = useState(initialData?.subjective || '');
    const [objective, setObjective] = useState(initialData?.objective || '');
    const [assessment, setAssessment] = useState(initialData?.assessment || '');
    const [plan, setPlan] = useState(initialData?.plan || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [showSignature, setShowSignature] = useState(false);
    const [isLocked, setIsLocked] = useState(initialData?.isLocked || false);

    const handleTemplateSelect = (template: any) => {
        if (template.subjective) setSubjective(template.subjective);
        if (template.objective) setObjective(template.objective);
        if (template.assessment) setAssessment(template.assessment);
        if (template.plan) setPlan(template.plan);
        if (template.content) setContent(template.content);
        setNoteType(template.noteType);
    };

    const handleSave = () => {
        const note = {
            patient: patientId,
            provider: providerId,
            appointment: appointmentId,
            noteType,
            ...(noteType === 'soap' ? { subjective, objective, assessment, plan } : { content })
        };
        onSave(note);
    };

    const handleSign = (signatureUrl: string) => {
        const note = {
            patient: patientId,
            provider: providerId,
            appointment: appointmentId,
            noteType,
            ...(noteType === 'soap' ? { subjective, objective, assessment, plan } : { content }),
            signatureUrl
        };
        onSave(note);
        setShowSignature(false);
    };

    if (isLocked) {
        return (
            <div className="note-locked">
                <p>Esta nota está assinada e bloqueada para edição.</p>
            </div>
        );
    }

    return (
        <div className="clinical-note-editor">
            <div className="editor-header">
                <select
                    value={noteType}
                    onChange={e => setNoteType(e.target.value as any)}
                    className="note-type-select"
                >
                    <option value="soap">SOAP</option>
                    <option value="progress">Progresso</option>
                    <option value="consultation">Consulta</option>
                    <option value="procedure">Procedimento</option>
                    <option value="other">Outro</option>
                </select>

                <TemplateSelector noteType={noteType} onSelect={handleTemplateSelect} />
            </div>

            {noteType === 'soap' ? (
                <div className="soap-editor">
                    <div className="soap-section">
                        <label>Subjetivo (S)</label>
                        <textarea
                            value={subjective}
                            onChange={e => setSubjective(e.target.value)}
                            placeholder="O que o paciente relata..."
                            rows={4}
                        />
                    </div>

                    <div className="soap-section">
                        <label>Objetivo (O)</label>
                        <textarea
                            value={objective}
                            onChange={e => setObjective(e.target.value)}
                            placeholder="Achados do exame clínico..."
                            rows={4}
                        />
                    </div>

                    <div className="soap-section">
                        <label>Avaliação (A)</label>
                        <textarea
                            value={assessment}
                            onChange={e => setAssessment(e.target.value)}
                            placeholder="Diagnóstico e análise..."
                            rows={4}
                        />
                    </div>

                    <div className="soap-section">
                        <label>Plano (P)</label>
                        <textarea
                            value={plan}
                            onChange={e => setPlan(e.target.value)}
                            placeholder="Plano de tratamento..."
                            rows={4}
                        />
                    </div>
                </div>
            ) : (
                <div className="content-editor">
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Conteúdo da nota clínica..."
                        rows={16}
                        className="content-textarea"
                    />
                </div>
            )}

            <div className="editor-actions">
                <button onClick={handleSave} className="save-btn">
                    Salvar Rascunho
                </button>
                <button onClick={() => setShowSignature(true)} className="sign-btn">
                    Assinar e Bloquear
                </button>
            </div>

            {showSignature && <SignaturePad onSave={handleSign} onCancel={() => setShowSignature(false)} />}
        </div>
    );
};
