import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const start = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Exibindo {start} - {end} de {totalItems}
      </div>
      
      <div className="pagination-controls">
        <button 
          disabled={currentPage <= 1} 
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>
        
        <span>Página {currentPage} de {totalPages}</span>
        
        <button 
          disabled={currentPage >= totalPages} 
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};
