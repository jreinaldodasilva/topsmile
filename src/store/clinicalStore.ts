// src/store/clinicalStore.ts
import { create } from 'zustand';

interface ClinicalState {
    // Dental Chart State
    selectedTooth: string | null;
    selectedSurface: string | null;
    chartMode: 'view' | 'edit';
    
    // Treatment Plan State
    activeTreatmentPlan: any | null;
    selectedPhase: number | null;
    
    // Clinical Notes State
    currentNote: any | null;
    
    // Actions
    setSelectedTooth: (tooth: string | null) => void;
    setSelectedSurface: (surface: string | null) => void;
    setChartMode: (mode: 'view' | 'edit') => void;
    setActiveTreatmentPlan: (plan: any | null) => void;
    setSelectedPhase: (phase: number | null) => void;
    setCurrentNote: (note: any | null) => void;
    resetClinicalState: () => void;
}

export const useClinicalStore = create<ClinicalState>((set) => ({
    // Initial State
    selectedTooth: null,
    selectedSurface: null,
    chartMode: 'view',
    activeTreatmentPlan: null,
    selectedPhase: null,
    currentNote: null,
    
    // Actions
    setSelectedTooth: (tooth) => set({ selectedTooth: tooth }),
    
    setSelectedSurface: (surface) => set({ selectedSurface: surface }),
    
    setChartMode: (mode) => set({ chartMode: mode }),
    
    setActiveTreatmentPlan: (plan) => set({ activeTreatmentPlan: plan }),
    
    setSelectedPhase: (phase) => set({ selectedPhase: phase }),
    
    setCurrentNote: (note) => set({ currentNote: note }),
    
    resetClinicalState: () => set({
        selectedTooth: null,
        selectedSurface: null,
        chartMode: 'view',
        activeTreatmentPlan: null,
        selectedPhase: null,
        currentNote: null
    })
}));
