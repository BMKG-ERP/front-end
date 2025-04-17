'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import Table from '@/components/table/Table';

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
  const [loadingTable, setLoadingTable] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const router = useRouter();

  const fetchData = async (
    sort = '',
    order = '',
    page = 1,
    limit = -1,
    search = ''
  ) => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_LOCAL_API}/api/stations/`);
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

      if (!result.error && result.code === 200) {
        return {
          data: result.data || [],
          pagination: result.pagination,
        };
      } else {
        console.error('Error fetching stations:', result.message);
        return {
          data: [],
          pagination: {
            total: 0,
            totalRows: 0,
            totalPages: 1,
          },
        };
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      return {
        data: [],
        pagination: {
          total: 0,
          totalRows: 0,
          totalPages: 1,
        },
      };
    }
  };

  useEffect(() => {
    fetchData('', '', pagination.page, pagination.limit, searchQuery);
  }, [pagination.page, pagination.limit]); // Added dependencies

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

  return (
    <div className="w-full max-w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div>
          <button
            className="bg-teal-800 rounded-xl p-3 text-white hover:bg-teal-600 "
            onClick={openCreateStation}
          >
            CREATE STATION
          </button>
        </div>
      </div>
      <div className="relative w-full h-full">
        <Table
          columns={columns}
          dataTable={true}
          fetchData={fetchData}
          colStyling={colStyling}
        />
      </div>
    </div>
  );
};

export default StationTable;
