'use client';

import { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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

const StationTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
  });

  const fetchData = async (
    sort = '',
    order = '',
    page = 1,
    limit = 10,
    search = ''
  ) => {
    setLoading(true);
    try {
      const url = new URL('http://127.0.0.1:8000/api/stations');
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
          className="flex items-center gap-1 cursor-pointer"
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
          className="flex items-center gap-1 cursor-pointer"
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
          className="flex items-center gap-1 cursor-pointer"
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
          className="flex items-center gap-1 cursor-pointer"
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
          className="text-blue-500 hover:text-blue-700 cursor-pointer flex items-center justify-center"
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
        <div className="flex gap-2 items-center justify-center">
          <FaEye
            className="text-black hover:text-gray-700 cursor-pointer"
            onClick={() => console.log('View', row.original)}
          />
          <FaEdit
            className="text-green-500 hover:text-green-700 cursor-pointer"
            onClick={() => console.log('Edit', row.original)}
          />
          <FaTrash
            className="text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => console.log('Delete', row.original)}
          />
        </div>
      ),
    },
  ];

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
      </div>
      <div className="relative w-full h-full">
        <table className="w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-blue-500 text-white">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-3 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
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
                  className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
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
