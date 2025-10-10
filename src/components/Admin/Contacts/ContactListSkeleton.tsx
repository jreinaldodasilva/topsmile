import React from 'react';
import './ContactListSkeleton.css';

const ContactListSkeleton: React.FC = () => {
    const skeletonRows = Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="skeleton-row">
            <td>
                <div className="skeleton-checkbox"></div>
            </td>
            <td>
                <div className="skeleton-text"></div>
            </td>
            <td>
                <div className="skeleton-text"></div>
            </td>
            <td>
                <div className="skeleton-text"></div>
            </td>
            <td>
                <div className="skeleton-text"></div>
            </td>
            <td>
                <div className="skeleton-text"></div>
            </td>
            <td>
                <div className="skeleton-text"></div>
            </td>
            <td>
                <div className="skeleton-text"></div>
            </td>
            <td>
                <div className="skeleton-actions"></div>
            </td>
        </tr>
    ));

    return (
        <div className="contact-list-skeleton">
            <table className="contact-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Clínica</th>
                        <th>Especialidade</th>
                        <th>Telefone</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>{skeletonRows}</tbody>
            </table>
        </div>
    );
};

export default ContactListSkeleton;
