// backend/src/config/cdtCodes.ts
export interface CDTCode {
    code: string;
    description: string;
    category: string;
    defaultCost: number;
}

export const CDT_CODES: CDTCode[] = [
    // Diagnostic
    { code: 'D0120', description: 'Exame oral periódico', category: 'Diagnóstico', defaultCost: 50 },
    { code: 'D0140', description: 'Avaliação oral limitada', category: 'Diagnóstico', defaultCost: 40 },
    { code: 'D0150', description: 'Exame oral abrangente', category: 'Diagnóstico', defaultCost: 80 },
    { code: 'D0210', description: 'Radiografia intraoral completa', category: 'Diagnóstico', defaultCost: 120 },
    { code: 'D0220', description: 'Radiografia periapical', category: 'Diagnóstico', defaultCost: 30 },
    { code: 'D0230', description: 'Radiografia bite-wing', category: 'Diagnóstico', defaultCost: 40 },
    { code: 'D0330', description: 'Radiografia panorâmica', category: 'Diagnóstico', defaultCost: 100 },
    
    // Preventive
    { code: 'D1110', description: 'Profilaxia - adulto', category: 'Preventivo', defaultCost: 90 },
    { code: 'D1120', description: 'Profilaxia - criança', category: 'Preventivo', defaultCost: 70 },
    { code: 'D1206', description: 'Aplicação de flúor tópico', category: 'Preventivo', defaultCost: 35 },
    { code: 'D1351', description: 'Selante por dente', category: 'Preventivo', defaultCost: 50 },
    
    // Restorative
    { code: 'D2140', description: 'Restauração de amálgama - 1 superfície', category: 'Restaurador', defaultCost: 120 },
    { code: 'D2150', description: 'Restauração de amálgama - 2 superfícies', category: 'Restaurador', defaultCost: 150 },
    { code: 'D2160', description: 'Restauração de amálgama - 3 superfícies', category: 'Restaurador', defaultCost: 180 },
    { code: 'D2330', description: 'Restauração de resina - 1 superfície', category: 'Restaurador', defaultCost: 140 },
    { code: 'D2331', description: 'Restauração de resina - 2 superfícies', category: 'Restaurador', defaultCost: 170 },
    { code: 'D2332', description: 'Restauração de resina - 3 superfícies', category: 'Restaurador', defaultCost: 200 },
    { code: 'D2740', description: 'Coroa - porcelana fundida em metal', category: 'Restaurador', defaultCost: 1200 },
    { code: 'D2750', description: 'Coroa - porcelana', category: 'Restaurador', defaultCost: 1400 },
    { code: 'D2790', description: 'Coroa - completa fundida', category: 'Restaurador', defaultCost: 1100 },
    
    // Endodontics
    { code: 'D3310', description: 'Tratamento de canal - anterior', category: 'Endodontia', defaultCost: 600 },
    { code: 'D3320', description: 'Tratamento de canal - pré-molar', category: 'Endodontia', defaultCost: 750 },
    { code: 'D3330', description: 'Tratamento de canal - molar', category: 'Endodontia', defaultCost: 950 },
    
    // Periodontics
    { code: 'D4210', description: 'Gengivectomia - por quadrante', category: 'Periodontia', defaultCost: 400 },
    { code: 'D4341', description: 'Raspagem e alisamento - por quadrante', category: 'Periodontia', defaultCost: 200 },
    
    // Prosthodontics
    { code: 'D5110', description: 'Dentadura completa - superior', category: 'Prótese', defaultCost: 1800 },
    { code: 'D5120', description: 'Dentadura completa - inferior', category: 'Prótese', defaultCost: 1800 },
    { code: 'D5213', description: 'Prótese parcial - superior', category: 'Prótese', defaultCost: 1500 },
    { code: 'D5214', description: 'Prótese parcial - inferior', category: 'Prótese', defaultCost: 1500 },
    { code: 'D6010', description: 'Implante cirúrgico', category: 'Prótese', defaultCost: 2500 },
    { code: 'D6058', description: 'Pilar de implante', category: 'Prótese', defaultCost: 800 },
    { code: 'D6065', description: 'Coroa sobre implante', category: 'Prótese', defaultCost: 1600 },
    
    // Oral Surgery
    { code: 'D7140', description: 'Extração - dente erupcionado', category: 'Cirurgia', defaultCost: 150 },
    { code: 'D7210', description: 'Extração - dente impactado', category: 'Cirurgia', defaultCost: 300 },
    { code: 'D7240', description: 'Remoção de dente impactado', category: 'Cirurgia', defaultCost: 400 },
    
    // Orthodontics
    { code: 'D8080', description: 'Tratamento ortodôntico abrangente', category: 'Ortodontia', defaultCost: 5000 },
    { code: 'D8090', description: 'Tratamento ortodôntico limitado', category: 'Ortodontia', defaultCost: 2500 }
];

export const getCDTCodesByCategory = (category: string): CDTCode[] => {
    return CDT_CODES.filter(code => code.category === category);
};

export const getCDTCodeByCode = (code: string): CDTCode | undefined => {
    return CDT_CODES.find(c => c.code === code);
};

export const CDT_CATEGORIES = [
    'Diagnóstico',
    'Preventivo',
    'Restaurador',
    'Endodontia',
    'Periodontia',
    'Prótese',
    'Cirurgia',
    'Ortodontia'
];
