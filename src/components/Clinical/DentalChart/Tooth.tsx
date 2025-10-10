import React from 'react';

interface ToothProps {
    number: string;
    x: number;
    y: number;
    conditions: Array<{
        type: string;
        status: string;
    }>;
    selected: boolean;
    onClick: (number: string) => void;
}

export const Tooth: React.FC<ToothProps> = ({ number, x, y, conditions, selected, onClick }) => {
    const getToothColor = () => {
        if (conditions.length === 0) return '#ffffff';

        const hasExisting = conditions.some(c => c.status === 'existing');
        const hasPlanned = conditions.some(c => c.status === 'planned');

        if (hasExisting) return '#ffcccc';
        if (hasPlanned) return '#ffffcc';
        return '#ffffff';
    };

    return (
        <g onClick={() => onClick(number)} style={{ cursor: 'pointer' }}>
            <rect
                x={x}
                y={y}
                width="30"
                height="40"
                fill={getToothColor()}
                stroke={selected ? '#007bff' : '#333'}
                strokeWidth={selected ? '3' : '1'}
                rx="3"
            />
            <text
                x={x + 15}
                y={y + 25}
                textAnchor="middle"
                fontSize="12"
                fill="#333"
                fontWeight={selected ? 'bold' : 'normal'}
            >
                {number}
            </text>
        </g>
    );
};
