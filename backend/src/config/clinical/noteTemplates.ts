// backend/src/config/noteTemplates.ts
export interface NoteTemplate {
    id: string;
    name: string;
    noteType: 'soap' | 'progress' | 'consultation' | 'procedure' | 'other';
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    content?: string;
}

export const NOTE_TEMPLATES: NoteTemplate[] = [
    {
        id: 'soap_routine',
        name: 'Consulta de Rotina (SOAP)',
        noteType: 'soap',
        subjective: 'Paciente relata: ',
        objective: 'Exame clínico:\n- Condição geral: \n- Higiene oral: \n- Tecidos moles: \n- Dentes: ',
        assessment: 'Diagnóstico: ',
        plan: 'Plano de tratamento:\n1. '
    },
    {
        id: 'soap_emergency',
        name: 'Atendimento de Emergência (SOAP)',
        noteType: 'soap',
        subjective: 'Queixa principal: \nDuração: \nIntensidade da dor (0-10): ',
        objective: 'Exame clínico:\n- Dente afetado: \n- Sinais clínicos: \n- Testes de vitalidade: ',
        assessment: 'Diagnóstico provisório: ',
        plan: 'Tratamento imediato:\n- Medicação: \n- Procedimento: \n- Retorno: '
    },
    {
        id: 'procedure_restoration',
        name: 'Restauração Dentária',
        noteType: 'procedure',
        content: 'Procedimento: Restauração\nDente: \nSuperfícies: \nMaterial: \nAnestesia: \nIsolamento: \nTécnica: \nAcabamento: \nOrientações: '
    },
    {
        id: 'procedure_extraction',
        name: 'Extração Dentária',
        noteType: 'procedure',
        content: 'Procedimento: Extração\nDente: \nIndicação: \nAnestesia: \nTécnica: \nComplicações: Nenhuma\nSutura: \nOrientações pós-operatórias: \nMedicação prescrita: \nRetorno: '
    },
    {
        id: 'procedure_endodontic',
        name: 'Tratamento Endodôntico',
        noteType: 'procedure',
        content: 'Procedimento: Endodontia\nDente: \nSessão: \nAnestesia: \nIsolamento absoluto: Sim\nAcesso: \nOdontometria: \nInstrumentação: \nIrrigação: \nMedicação intracanal: \nRestauração provisória: \nRetorno: '
    },
    {
        id: 'progress_orthodontic',
        name: 'Acompanhamento Ortodôntico',
        noteType: 'progress',
        content: 'Consulta de acompanhamento ortodôntico\nTempo de tratamento: \nMovimentação observada: \nAjustes realizados: \nTroca de arcos/acessórios: \nColaboração do paciente: \nPróxima etapa: \nRetorno: '
    },
    {
        id: 'consultation_initial',
        name: 'Consulta Inicial',
        noteType: 'consultation',
        content: 'Primeira consulta\nMotivo da consulta: \nHistórico médico revisado: Sim\nExame clínico completo realizado\nRadiografias solicitadas: \nDiagnóstico: \nPlano de tratamento proposto: \nOrçamento apresentado: \nPróximos passos: '
    },
    {
        id: 'progress_periodontal',
        name: 'Acompanhamento Periodontal',
        noteType: 'progress',
        content: 'Reavaliação periodontal\nÍndice de placa: \nSangramento à sondagem: \nProfundidade de sondagem: \nMobilidade dentária: \nTratamento realizado: \nOrientações de higiene: \nRetorno: '
    }
];

export const getTemplateById = (id: string): NoteTemplate | undefined => {
    return NOTE_TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByType = (noteType: string): NoteTemplate[] => {
    return NOTE_TEMPLATES.filter(t => t.noteType === noteType);
};
