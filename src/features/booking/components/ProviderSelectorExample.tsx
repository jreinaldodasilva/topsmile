// src/features/booking/components/ProviderSelectorExample.tsx
import React, { useEffect } from 'react';
import { useProviders } from '../../providers/hooks/useProviders';

interface ProviderSelectorExampleProps {
    clinicId: string;
    onSelect: (providerId: string | null) => void;
    selectedProvider?: string | null;
}

export const ProviderSelectorExample: React.FC<ProviderSelectorExampleProps> = ({
    clinicId,
    onSelect,
    selectedProvider
}) => {
    const { providers, loading, error, getProviders } = useProviders();

    useEffect(() => {
        getProviders({ clinicId });
    }, [clinicId, getProviders]);

    if (loading) return <div>Carregando profissionais...</div>;
    if (error) return <div>Erro: {error}</div>;

    return (
        <div className="provider-selector">
            <h3>Escolha um Profissional (Opcional)</h3>

            <div className="providers-grid">
                <div
                    className={`provider-card ${selectedProvider === null ? 'selected' : ''}`}
                    onClick={() => onSelect(null)}
                >
                    <div className="provider-photo no-preference">
                        <span>👥</span>
                    </div>
                    <h4>Sem Preferência</h4>
                    <p>Primeiro horário disponível</p>
                </div>

                {providers.map(provider => (
                    <div
                        key={provider.id}
                        className={`provider-card ${selectedProvider === provider.id ? 'selected' : ''}`}
                        onClick={() => onSelect(provider.id)}
                    >
                        <div className="provider-photo">
                            {provider.photoUrl ? (
                                <img src={provider.photoUrl} alt={provider.name} />
                            ) : (
                                <span>{provider.name.charAt(0)}</span>
                            )}
                        </div>
                        <h4>{provider.name}</h4>
                        {provider.specialties?.length > 0 && (
                            <p className="specialties">{provider.specialties.join(', ')}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
