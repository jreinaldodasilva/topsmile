import React from 'react';
import type { Contact } from '@topsmile/types';

interface ContactTableProps {
    contacts: Contact[];
    selectedContacts: Set<string>;
    sort: Record<string, any>;
    onSelectAll: (selected: boolean) => void;
    onSelectContact: (id: string, selected: boolean) => void;
    onSort: (field: string) => void;
    onView: (contact: Contact) => void;
    onStatusUpdate: (id: string, status: Contact['status']) => void;
    onDelete: (id: string) => void;
}

export const ContactTable: React.FC<ContactTableProps> = ({
    contacts,
    selectedContacts,
    sort,
    onSelectAll,
    onSelectContact,
    onSort,
    onView,
    onStatusUpdate,
    onDelete
}) => (
    <table className="contact-table">
        <thead>
            <tr>
                <th>
                    <input
                        type="checkbox"
                        checked={selectedContacts.size === contacts.length && contacts.length > 0}
                        onChange={e => onSelectAll(e.target.checked)}
                    />
                </th>
                {['name', 'email', 'clinic', 'specialty', 'phone', 'status', 'createdAt'].map(field => (
                    <th key={field} onClick={() => field !== 'phone' && onSort(field)}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                        {sort[field] && (sort[field] === 1 ? '▲' : '▼')}
                    </th>
                ))}
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {contacts.map(contact => {
                const contactId = contact._id || contact.id || '';
                return (
                    <tr key={contactId}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedContacts.has(contactId)}
                                onChange={e => onSelectContact(contactId, e.target.checked)}
                            />
                        </td>
                        <td>{contact.name}</td>
                        <td>
                            <a href={`mailto:${contact.email}`}>{contact.email}</a>
                        </td>
                        <td>{contact.clinic}</td>
                        <td>{contact.specialty}</td>
                        <td>
                            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                        </td>
                        <td>
                            <select
                                value={contact.status || 'new'}
                                onChange={e => onStatusUpdate(contactId, e.target.value as Contact['status'])}
                            >
                                <option value="new">Novo</option>
                                <option value="contacted">Contatado</option>
                                <option value="qualified">Qualificado</option>
                                <option value="converted">Convertido</option>
                                <option value="closed">Fechado</option>
                            </select>
                        </td>
                        <td>{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                        <td>
                            <button onClick={() => onView(contact)}>👁️</button>
                            <button onClick={() => onDelete(contactId)}>🗑️</button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
);
