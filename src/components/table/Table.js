'use client';
import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import Pagination from './Pagination';
import Limit from './Limit';
import { FaSearch, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const Table = ({
  columns,
  fetchData,
  dataTable = false,
  initialData = [],
  data: dataProp,
  colStyling,
  createButton,
  createFunction,
  createName,
}) => {
  const [data, setData] = useState(dataProp || initialData || []);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(() => {
    const totalRows = dataTable ? initialData?.length || 0 : 0;
    const totalPages = dataTable ? Math.ceil(totalRows / 10) : 1;
    return {
      page: 1,
      totalPages,
      totalRows,
      limit: 10,
    };
  });

  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Client-side data handling
  useEffect(() => {
    if (dataTable) {
      fetchData({ limit: -1 }).then((res) => {
        const allRows = res.data || [];
        setFullData(allRows);

        setPagination((prev) => ({
          ...prev,
          page: 1,
          totalRows: allRows.length,
          totalPages: Math.ceil(allRows.length / prev.limit),
        }));
        setLoading(false);
      });
    }
  }, [dataTable, fetchData]);

  const filteredData = useMemo(() => {
    if (!dataTable) return data;

    let filtered = [...fullData];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    // Sort the filtered data
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      filtered.sort((a, b) => {
        const aVal = a[id];
        const bVal = b[id];

        if (aVal < bVal) return desc ? 1 : -1;
        if (aVal > bVal) return desc ? -1 : 1;
        return 0;
      });
    }

    const totalRows = filtered.length;
    const totalPages = Math.ceil(totalRows / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    const paged = filtered.slice(start, end);

    if (
      pagination.totalRows !== totalRows ||
      pagination.totalPages !== totalPages
    ) {
      setPagination((prev) => ({
        ...prev,
        totalRows,
        totalPages,
      }));
    }

    return paged;
  }, [
    dataTable,
    fullData,
    pagination.page,
    pagination.limit,
    searchQuery,
    sorting,
  ]);

  const SortIcon = ({ column }) => {
    return column.getIsSorted() === 'asc' ? (
      <FaSortUp />
    ) : column.getIsSorted() === 'desc' ? (
      <FaSortDown />
    ) : (
      <FaSort />
    );
  };

  const table = useReactTable({
    data: dataTable ? filteredData : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
      totalPages: dataTable
        ? Math.ceil(data.length / newLimit)
        : prev.totalPages,
    }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="relative w-full md:w-1/3 mb-2 md:mb-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Search stations..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          <FaSearch className="absolute right-2 top-3 text-gray-400" />
        </div>

        {createButton && (
          <div className="mt-2 md:mt-0">
            <button
              className="bg-teal-800 rounded-xl p-3 text-white hover:bg-teal-600"
              onClick={createFunction}
            >
              {createName}
            </button>
          </div>
        )}
      </div>

      <table className="w-full border border-gray-600 bg-teal-800 shadow-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="text-white
             font-bold
             border-gray-400
             "
            >
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted(); // false | 'asc' | 'desc'

                return (
                  <th
                    key={header.id}
                    className="border-y p-3 py-5 text-center cursor-pointer select-none"
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center justify-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <SortIcon column={header.column} />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="bg-white border-gray-400">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-20">
                Loading...
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                //   className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}
              >
                {row.getVisibleCells().map((cell) => {
                  // Get the column ID and corresponding style
                  const columnId = cell.column.id;
                  const cellStyle = colStyling[columnId] || ''; // Default to no extra style if not specified

                  return (
                    <td
                      key={cell.id}
                      className={`border-y p-4 px-5 border-gray-400 ${cellStyle}`} // Apply specific styles
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 px-2">
        <div className="text-sm text-gray-700 flex flex-row">
          <Limit
            pagination={pagination}
            handleLimitChange={handleLimitChange}
          />
        </div>
        <div className="flex items-center gap-1">
          <Pagination
            pagination={pagination}
            onPageChange={(newPage) =>
              setPagination((prev) => ({ ...prev, page: newPage }))
            }
          />
        </div>
      </div>
    </>
  );
};

export default Table;
