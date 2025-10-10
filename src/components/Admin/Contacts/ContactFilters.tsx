import React from 'react';
import type { ContactFilters as Filters } from '@topsmile/types';

interface ContactFiltersProps {
    filters: Filters;
    searchQuery: string;
    onSearch: (query: string) => void;
    onStatusFilter: (status: string) => void;
    onPriorityFilter: (priority: string) => void;
}

export const ContactFilters: React.FC<ContactFiltersProps> = ({
    filters,
    searchQuery,
    onSearch,
    onStatusFilter,
    onPriorityFilter
}) => (
    <div className="contact-filters">
        <div className="search-box">
            <input
                className="search-input"
                type="text"
                placeholder="Buscar por nome, email, clínica..."
                value={searchQuery}
                onChange={e => onSearch(e.target.value)}
            />
        </div>

        <div className="status-filters">
            {['all', 'new', 'contacted', 'qualified', 'converted', 'closed'].map(status => (
                <button
                    key={status}
                    className={`filter-button ${(!filters.status && status === 'all') || filters.status === status ? 'active' : ''}`}
                    onClick={() => onStatusFilter(status)}
                >
                    {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
            ))}
        </div>

        <div className="priority-filters">
            <label>Prioridade:</label>
            {['all', 'high', 'medium', 'low'].map(priority => (
                <button
                    key={priority}
                    className={`filter-button ${(!filters.priority && priority === 'all') || filters.priority === priority ? 'active' : ''}`}
                    onClick={() => onPriorityFilter(priority)}
                >
                    {priority === 'all' ? 'Todas' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
            ))}
        </div>
    </div>
);
