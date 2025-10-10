// src/components/Clinical/ClinicalNotes/SignaturePad.tsx
import React, { useRef, useState, useEffect } from 'react';
import './SignaturePad.css';

interface SignaturePadProps {
    onSave: (signatureUrl: string) => void;
    onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        setIsEmpty(false);
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
    };

    const save = () => {
        const canvas = canvasRef.current;
        if (!canvas || isEmpty) return;

        const signatureUrl = canvas.toDataURL('image/png');
        onSave(signatureUrl);
    };

    return (
        <div className="signature-modal">
            <div className="signature-content">
                <h3>Assinar Nota Clínica</h3>
                <p>Desenhe sua assinatura abaixo:</p>

                <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="signature-canvas"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />

                <div className="signature-actions">
                    <button onClick={clear} className="clear-btn">
                        Limpar
                    </button>
                    <button onClick={onCancel} className="cancel-btn">
                        Cancelar
                    </button>
                    <button onClick={save} className="save-sig-btn" disabled={isEmpty}>
                        Assinar
                    </button>
                </div>
            </div>
        </div>
    );
};
