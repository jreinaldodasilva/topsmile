import React from 'react';
import Skeleton from '../Skeleton/Skeleton';
import './Table.css';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
    width?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (row: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

const TableSkeleton: React.FC<{ columns: number; rows: number }> = ({ columns, rows }) => (
    <div className="table-container">
        <table className="table">
            <thead className="table__head">
                <tr>
                    {Array.from({ length: columns }).map((_, idx) => (
                        <th key={idx}><Skeleton width="80%" height="20px" /></th>
                    ))}
                </tr>
            </thead>
            <tbody className="table__body">
                {Array.from({ length: rows }).map((_, rowIdx) => (
                    <tr key={rowIdx}>
                        {Array.from({ length: columns }).map((_, colIdx) => (
                            <td key={colIdx}><Skeleton width="90%" height="16px" /></td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export function Table<T extends { id?: string; _id?: string }>({
    data,
    columns,
    onRowClick,
    isLoading,
    emptyMessage = 'Nenhum registro encontrado'
}: TableProps<T>) {
    if (isLoading) {
        return <TableSkeleton columns={columns.length} rows={5} />;
    }
    
    if (!data.length) {
        return (
            <div className="table-empty">
                <p>{emptyMessage}</p>
            </div>
        );
    }
    
    return (
        <div className="table-container">
            <table className="table">
                <thead className="table__head">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} style={{ width: col.width }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table__body">
                    {data.map((row, idx) => (
                        <tr
                            key={row.id || row._id || idx}
                            onClick={() => onRowClick?.(row)}
                            className={onRowClick ? 'table__row--clickable' : ''}
                        >
                            {columns.map((col, colIdx) => (
                                <td key={colIdx}>
                                    {col.render
                                        ? col.render(row)
                                        : String(row[col.key as keyof T] || '')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
