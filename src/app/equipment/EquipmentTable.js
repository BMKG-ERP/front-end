'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const EquipmentTable = ({
  openCreateEquipment,
  setIsLoading,
  openEditEquipment,
  openDeleteEquipment,
}) => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const url = new URL(
        `${process.env.NEXT_PUBLIC_LOCAL_API}/api/equipments/`
      );
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
      accessorKey: 'equipment_id',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Equipment ID
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'serial_number',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Serial Number
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Name
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
      accessorKey: 'manufacture',
      header: 'Manufacture',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'input',
      header: 'Input',
    },
    {
      accessorKey: 'installation_date',
      header: 'Instalation Date',
    },
    {
      accessorKey: 'calibration_date',
      header: 'Calibration Date',
    },
    {
      accessorKey: 'firmware_version',
      header: 'Firmware Version',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'technician',
      header: 'Technician',
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Status
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4 items-center justify-center">
          <div className="relative group">
            <FaEye
              className="text-xl text-cyan-700 hover:text-cyan-900 cursor-pointer"
              onClick={() =>
                router.push(`/equipment/${row.original.equipment_id}`)
              }
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </span>
          </div>

          <div className="relative group">
            <FaEdit
              className="text-xl text-emerald-700 hover:text-emerald-900 cursor-pointer"
              onClick={() => openEditEquipment(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>

          <div className="relative group">
            <FaTrash
              className="text-xl text-rose-700 hover:text-rose-900 cursor-pointer"
              onClick={() => openDeleteEquipment(row.original)}
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
    equipment_id: 'font-bold text-blue-950', // Bold & blue
    status: 'font-bold text-blue-950', // Bold & blue
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
            onClick={openCreateEquipment}
          >
            Create Equipment
          </button>
        </div>
      </div>
      <div className="relative w-full h-full">
        <table className="w-full border border-cyan-700 rounded-lg shadow-md">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="text-cyan-900 text-sm font-bold"
              >
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
          <tbody className="bg-white border-cyan-700 text-[12px]">
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

export default EquipmentTable;
