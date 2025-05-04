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
import FilterDropdown from './FilterDropdown';

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
  fontSize = '14', // default Tailwind font size
  categories,
  searchPlaceholder,
  miniSize = false, // <-- ADDED
  isSearch = true,
  fetchParams = {},
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
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [pendingCategoryFilters, setPendingCategoryFilters] = useState([]);

  const stableFetchParams = useMemo(
    () => fetchParams,
    [JSON.stringify(fetchParams)]
  );

  useEffect(() => {
    if (!dataTable) return;

    const isUsingParams =
      stableFetchParams && Object.keys(stableFetchParams).length > 0;
    const params = isUsingParams
      ? { limit: -1, ...stableFetchParams }
      : { limit: -1 };

    setLoading(true);

    fetchData(params).then((res) => {
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
  }, [dataTable, fetchData, stableFetchParams]);

  const filteredData = useMemo(() => {
    if (!dataTable) return data;

    let filtered = [...fullData];

    if (categoryFilters.length > 0) {
      filtered = filtered.filter((row) =>
        categoryFilters.includes(row.category)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

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
    categoryFilters,
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
      <div
        className={`flex items-center gap-4 mb-4 ${miniSize ? 'text-sm' : ''}`}
      >
        {/* Filter Dropdown */}
        {categories && (
          <div className="w-full md:w-auto">
            <FilterDropdown
              pendingCategoryFilters={pendingCategoryFilters}
              setPendingCategoryFilters={setPendingCategoryFilters}
              setCategoryFilters={setCategoryFilters}
              setPagination={setPagination}
              categories={categories}
            />
          </div>
        )}

        {/* Search Input */}
        {isSearch && (
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder={searchPlaceholder}
              className={`w-full border border-gray-300 rounded 
              ${miniSize ? 'p-1 text-sm' : 'p-2'}
            `}
            />
            <FaSearch
              className={`absolute right-2 ${
                miniSize ? 'top-2' : 'top-3'
              } text-gray-400`}
            />
          </div>
        )}

        {/* Create Button (Optional) */}
        {createButton && (
          <div className="ml-auto">
            <button
              className={`rounded-xl text-white hover:bg-teal-600
                ${miniSize ? 'p-2 text-sm bg-teal-700' : 'p-3 bg-teal-800'}
              `}
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
              className="text-white font-bold border-gray-400"
              style={{
                fontSize: miniSize
                  ? `${parseInt(fontSize) - 2}px`
                  : `${fontSize}px`,
              }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`border-y text-center cursor-pointer select-none
                    ${miniSize ? 'p-2 py-3' : 'p-3 py-5'}
                  `}
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
              ))}
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
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-20 text-gray-500"
              >
                No Data Found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const columnId = cell.column.id;
                  const cellStyle = colStyling[columnId] || '';

                  return (
                    <td
                      key={cell.id}
                      className={`border-y border-gray-400 ${cellStyle} 
                        ${miniSize ? 'p-2 px-3' : 'p-4 px-5'}
                      `}
                      style={{
                        fontSize: miniSize
                          ? `${parseInt(fontSize) - 2}px`
                          : `${fontSize}px`,
                      }}
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

      <div
        className={`flex justify-between items-center mt-4 px-2 ${
          miniSize ? 'text-sm' : ''
        }`}
      >
        <div className="text-gray-700 flex flex-row">
          <Limit
            pagination={pagination}
            handleLimitChange={handleLimitChange}
            miniSize={miniSize} // Pass if needed
          />
        </div>
        <div className="flex items-center gap-1">
          <Pagination
            pagination={pagination}
            onPageChange={(newPage) =>
              setPagination((prev) => ({ ...prev, page: newPage }))
            }
            miniSize={miniSize} // Pass if needed
          />
        </div>
      </div>
    </>
  );
};

export default Table;
