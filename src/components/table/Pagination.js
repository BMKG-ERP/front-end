import React from 'react';

const Pagination = ({ pagination, onPageChange, miniSize = false }) => {
  const current = pagination.page;
  const total = pagination.totalPages || 1;

  const pages = [];

  let start = Math.max(current - 2, 1);
  let end = Math.min(start + 2, total);

  if (end - start < 2) {
    start = Math.max(end - 2, 1);
  }

  const buttonClass = miniSize ? 'px-2 py-0.5 text-[8px]' : 'px-3 py-1 text-sm';

  // Always show the first page
  if (start > 1) {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`border rounded ${buttonClass} ${
          current === 1
            ? 'bg-teal-800 text-white font-bold'
            : 'hover:bg-teal-800'
        }`}
      >
        1
      </button>
    );

    if (start > 2) {
      pages.push(
        <button
          key="start-ellipsis"
          onClick={() => onPageChange(start - 1)}
          className={`border rounded ${buttonClass} hover:bg-teal-800`}
        >
          ...
        </button>
      );
    }
  }

  // Page buttons in range
  for (let i = start; i <= end; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`border rounded ${buttonClass} ${
          i === current
            ? 'bg-teal-800 text-white font-bold'
            : 'text-black hover:text-white hover:bg-teal-800'
        }`}
      >
        {i}
      </button>
    );
  }

  // Last page button
  if (current < total - 2) {
    if (end < total - 1) {
      pages.push(
        <button
          key="end-ellipsis"
          onClick={() => onPageChange(end + 1)}
          className={`border rounded ${buttonClass} hover:bg-teal-800`}
        >
          ...
        </button>
      );
    }
    pages.push(
      <button
        key={total}
        onClick={() => onPageChange(total)}
        className={`border rounded ${buttonClass} ${
          current === total
            ? 'bg-teal-800 text-white font-bold'
            : 'hover:bg-teal-800'
        }`}
      >
        {total}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className={`border rounded ${buttonClass} disabled:opacity-50`}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {pages}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(current + 1, total))}
        disabled={current === total}
        className={`border rounded ${buttonClass} disabled:opacity-50`}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
