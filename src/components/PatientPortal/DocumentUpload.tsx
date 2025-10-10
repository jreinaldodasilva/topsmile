// src/components/PatientPortal/DocumentUpload.tsx
import React, { useState } from 'react';
import './DocumentUpload.css';

interface DocumentUploadProps {
    patientId: string;
    onUploadComplete: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ patientId, onUploadComplete }) => {
    const [documentType, setDocumentType] = useState('insurance_card');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64 = reader.result as string;

            const res = await fetch('/api/documents/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    documentType,
                    fileData: base64,
                    fileName: file.name
                })
            });

            setUploading(false);
            if (res.ok) {
                setFile(null);
                onUploadComplete();
            }
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="document-upload">
            <h3>Enviar Documento</h3>

            <div className="upload-form">
                <label>
                    Tipo de Documento
                    <select value={documentType} onChange={e => setDocumentType(e.target.value)}>
                        <option value="insurance_card">Carteirinha do Seguro</option>
                        <option value="id_document">Documento de Identidade</option>
                        <option value="photo">Foto</option>
                        <option value="consent_form">Termo de Consentimento</option>
                        <option value="other">Outro</option>
                    </select>
                </label>

                <div className="file-input">
                    <input type="file" onChange={handleFileChange} accept="image/*,application/pdf" />
                    {file && <span className="file-name">{file.name}</span>}
                </div>

                <button onClick={handleUpload} disabled={!file || uploading} className="upload-btn">
                    {uploading ? 'Enviando...' : 'Enviar Documento'}
                </button>
            </div>
        </div>
    );
};
