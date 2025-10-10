// src/components/PatientPortal/FamilyLinking.tsx
import React, { useState, useEffect } from 'react';
import './FamilyLinking.css';

interface FamilyMember {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    dateOfBirth?: string;
}

interface FamilyLinkingProps {
    patientId: string;
}

export const FamilyLinking: React.FC<FamilyLinkingProps> = ({ patientId }) => {
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);

    useEffect(() => {
        fetchFamilyMembers();
    }, [patientId]);

    const fetchFamilyMembers = async () => {
        const res = await fetch(`/api/family/${patientId}`);
        const data = await res.json();
        if (data.success) setMembers(data.data);
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        const res = await fetch(`/api/patients?search=${searchQuery}`);
        const data = await res.json();
        if (data.success) setSearchResults(data.data);
    };

    const handleLink = async (memberId: string) => {
        const res = await fetch('/api/family/link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                primaryPatientId: patientId,
                memberIds: [memberId]
            })
        });
        if (res.ok) {
            fetchFamilyMembers();
            setSearchResults([]);
            setSearchQuery('');
        }
    };

    const handleUnlink = async (memberId: string) => {
        const res = await fetch(`/api/family/unlink/${patientId}/${memberId}`, {
            method: 'DELETE'
        });
        if (res.ok) fetchFamilyMembers();
    };

    return (
        <div className="family-linking">
            <h3>Membros da Família</h3>

            <div className="current-members">
                {members.length === 0 ? (
                    <p className="no-members">Nenhum membro da família vinculado</p>
                ) : (
                    members.map(member => (
                        <div key={member.id} className="member-card">
                            <div className="member-info">
                                <strong>
                                    {member.firstName} {member.lastName}
                                </strong>
                                <span>{member.phone}</span>
                            </div>
                            <button onClick={() => handleUnlink(member.id)} className="unlink-btn">
                                Desvincular
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="add-member">
                <h4>Adicionar Membro</h4>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou telefone"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch} className="search-btn">
                        Buscar
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map(result => (
                            <div key={result.id} className="result-card">
                                <div className="result-info">
                                    <strong>
                                        {result.firstName} {result.lastName}
                                    </strong>
                                    <span>{result.phone}</span>
                                </div>
                                <button onClick={() => handleLink(result.id)} className="link-btn">
                                    Vincular
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
