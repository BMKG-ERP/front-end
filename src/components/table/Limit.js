import React from 'react';

const Limit = ({ pagination, handleLimitChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4">
      <div>
        <select
          value={pagination.limit}
          onChange={handleLimitChange}
          className="border p-2"
        >
          {' '}
          <option value={5}>5</option> <option value={10}>10</option>{' '}
          <option value={20}>20</option> <option value={50}>50</option>{' '}
        </select>{' '}
        from {pagination.totalRows || 0} records
      </div>
    </div>
  );
};

export default Limit;
