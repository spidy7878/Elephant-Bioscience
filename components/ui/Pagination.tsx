import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center gap-3 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all duration-300 text-sm font-medium"
            >
                Prev
            </button>

            <div className="flex items-center gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 font-medium border ${currentPage === page
                            ? 'bg-[rgba(160,26,31,0.84)] border-[#A01A1F] text-white shadow-[0_0_15px_rgba(160,26,31,0.4)] scale-105'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all duration-300 text-sm font-medium"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
