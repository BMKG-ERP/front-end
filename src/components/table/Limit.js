import React from 'react';

const Limit = ({ pagination, handleLimitChange, miniSize = false }) => {
  return (
    <div className="flex flex-row md:flex-row justify-between items-center mt-4">
      <div>
        <select
          value={pagination.limit}
          onChange={handleLimitChange}
          className={`border  ${miniSize ? ' text-xs' : 'p-2'}`}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>{' '}
        <h1 className={` ${miniSize ? 'text-xs' : 'text-md'}`}>
          from {pagination.totalRows || 0} records
        </h1>
      </div>
    </div>
  );
};

export default Limit;
