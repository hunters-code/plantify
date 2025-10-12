'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Ensure we always have at least 1 page
  const effectiveTotalPages = Math.max(totalPages, 1);

  // If there's only one page and it's explicitly set to 0 or 1, show a disabled pagination
  if (totalPages <= 0) {
    return (
      <div className='flex items-center justify-center gap-2 mt-10 text-sm'>
        <button
          disabled={true}
          className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow'
        >
          ‹
        </button>
        <button className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-purple-500 text-white font-medium shadow'>
          1
        </button>
        <button
          disabled={true}
          className='w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow'
        >
          ›
        </button>
      </div>
    );
  }

  // Calculate which page buttons to show
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // If there's only one page, return early
    if (effectiveTotalPages === 1) {
      return pages;
    }

    // Calculate range around current page
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(effectiveTotalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis1');
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < effectiveTotalPages - 1) {
      pages.push('ellipsis2');
    }

    // Always show last page if more than 1 page
    if (effectiveTotalPages > 1) {
      pages.push(effectiveTotalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='flex items-center justify-center gap-2 mt-10 text-sm'>
      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 shadow ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-neutral-100 hover:bg-gray-100 cursor-pointer'
        }`}
      >
        ‹
      </button>

      {/* Pages */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis1' || page === 'ellipsis2') {
          return (
            <span
              key={`ellipsis-${index}`}
              className='w-10 h-10 flex items-center justify-center text-gray-500'
            >
              …
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 shadow ${
              currentPage === page
                ? 'bg-purple-500 text-white font-medium'
                : 'bg-neutral-100 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() =>
          currentPage < effectiveTotalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === effectiveTotalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 shadow ${
          currentPage === effectiveTotalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-neutral-100 hover:bg-gray-100 cursor-pointer'
        }`}
      >
        ›
      </button>
    </div>
  );
}
