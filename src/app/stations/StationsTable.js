'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const SortIcon = ({ column }) => {
  return column.getIsSorted() === 'asc' ? (
    <FaSortUp />
  ) : column.getIsSorted() === 'desc' ? (
    <FaSortDown />
  ) : (
    <FaSort />
  );
};

const StationTable = ({
  openCreateStation,
  setIsLoading,
  openEditStation,
  openDeleteStation,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  const router = useRouter();

  const fetchData = async (
    sort = '',
    order = '',
    page = 1,
    limit = 10,
    search = ''
  ) => {
    setLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_LOCAL_API}/api/stations`);
      if (sort && order) {
        url.searchParams.append('sort', sort);
        url.searchParams.append('order', order);
      }
      url.searchParams.append('page', page);
      url.searchParams.append('limit', limit);
      if (search) {
        url.searchParams.append('search', search);
      }

      const response = await fetch(url.toString());
      const result = await response.json();
      console.log('Fetched Data:', result.data.length); // Debugging log

      if (!result.error && result.code === 200) {
        setData(result.data || []);
        setPagination((prev) => ({
          ...prev,
          page,
          total: result.pagination.total, // total records
          totalPages: result.pagination.totalPages,
          limit,
        }));
      } else {
        console.error('Error fetching stations:', result.message);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('', '', pagination.page, pagination.limit, searchQuery);
  }, [pagination.page, pagination.limit, searchQuery]); // Added dependencies

  const handleSort = (column) => {
    const currentSorting = sorting.find((s) => s.id === column.id);
    const newOrder = currentSorting?.desc ? 'asc' : 'desc';
    setSorting([{ id: column.id, desc: newOrder === 'desc' }]);
    fetchData(
      column.id,
      newOrder,
      pagination.page,
      pagination.limit,
      searchQuery
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchData('', '', newPage, pagination.limit, searchQuery);
    }
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    fetchData('', '', 1, newLimit, searchQuery);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    fetchData('', '', 1, pagination.limit, event.target.value);
  };

  const columns = [
    {
      accessorKey: 'station_code',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Station Code
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Category
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'city',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          City
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'province',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Province
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <button
          className="text-cyan-700 hover:text-cyan-900 cursor-pointer flex items-center justify-center"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(
                `https://www.google.com/maps?q=${row.original.latitude},${row.original.longitude}`,
                '_blank'
              );
            }
          }}
        >
          <FaMapMarkerAlt /> Show on Maps
        </button>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4 items-center justify-center">
          <div className="relative group">
            <FaEye
              className="text-xl text-cyan-700 hover:text-cyan-900 cursor-pointer"
              onClick={() => {
                setIsLoading(true);
                router.push(`/stations/${row.original.station_code}`);
              }}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </span>
          </div>

          <div className="relative group">
            <FaEdit
              className="text-xl text-emerald-700 hover:text-emerald-900 cursor-pointer"
              onClick={() => openEditStation(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>

          <div className="relative group">
            <FaTrash
              className="text-xl text-rose-700 hover:text-rose-900 cursor-pointer"
              onClick={() => openDeleteStation(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Delete
            </span>
          </div>
        </div>
      ),
    },
  ];

  const colStyling = {
    station_code: 'font-bold text-blue-950', // Bold & blue
    category: 'text-gray-700', // Green text
    city: 'text-gray-700', // Semi-bold
    province: 'text-gray-700', // Italic & purple
    description: 'text-gray-700', // Gray text
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="w-full max-w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search stations..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          <FaSearch className="absolute right-2 top-2 text-gray-400" />
        </div>
        <div>
          <button
            className="bg-teal-800 rounded-xl p-3 text-white hover:bg-teal-600 "
            onClick={openCreateStation}
          >
            CREATE STATION
          </button>
        </div>
      </div>
      <div className="relative w-full">
        <table className="w-full border border-cyan-700 rounded-lg shadow-md">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-cyan-900 font-bold">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-y p-3 py-5 text-center" // Center text alignment
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white border-cyan-700">
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
                        className={`border-y p-4 px-5 border-cyan-700 ${cellStyle}`} // Apply specific styles
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
      </div>
      <div className="flex justify-between items-center mt-4 px-2">
        {/* Left: Total Records */}
        <div className="text-sm text-gray-700">
          Total: {pagination.total || 0} records
        </div>

        {/* Right: Page Navigation */}
        <div className="flex items-center gap-1">
          {/* Previous Page */}
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }))
            }
            disabled={pagination.page === 1}
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
          >
            &lt;
          </button>

          {/* Page numbers */}
          {Array.from(
            { length: pagination.totalPages || 1 },
            (_, i) => i + 1
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: pageNum }))
              }
              className={`px-3 py-1 border rounded text-sm ${
                pageNum === pagination.page
                  ? 'bg-cyan-700 text-white'
                  : 'hover:bg-cyan-100'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Page */}
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.min(prev.page + 1, pagination.totalPages),
              }))
            }
            disabled={pagination.page === pagination.totalPages}
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <div>
          Show{' '}
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="border p-2"
          >
            {' '}
            <option value={5}>5</option> <option value={10}>10</option>{' '}
            <option value={20}>20</option> <option value={50}>50</option>{' '}
          </select>{' '}
          entries
        </div>
      </div>
    </div>
  );
};

export default StationTable;
