'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { FaEdit, FaTrash, FaEye, FaMapMarkerAlt } from 'react-icons/fa';
import Table from '@/components/table/Table';

const StationTable = ({
  openCreateStation,
  setIsLoading,
  openEditStation,
  openDeleteStation,
}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const dataTable = true;

  const router = useRouter();
  const [categories, setCategories] = useState([]);

  const fetchData = useCallback(
    async (sort = '', order = '', page = 1, limit = -1, search = '') => {
      try {
        const url = new URL(
          `${
            process.env.NEXT_PUBLIC_LOCAL_API +
            process.env.NEXT_PUBLIC_STATION_API
          }`
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
    },
    []
  );

  const fetchCategories = useCallback(async () => {
    try {
      const url = new URL(
        `${
          process.env.NEXT_PUBLIC_LOCAL_API +
          process.env.NEXT_PUBLIC_STATION_API +
          process.env.NEXT_PUBLIC_STATION_CATEGORIES_API
        }`
      );

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.error) {
        const categoryNames = result.data.map((item) => item.category);
        setCategories(categoryNames); // Only set the names
      } else {
        console.error('Error fetching categories:', result.message);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData('', '', 1, -1, '');
    fetchCategories();
  }, []);

  const columns = [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => {
        return (pagination.page - 1) * pagination.limit + row.index + 1;
      },
    },
    {
      accessorKey: 'station_code',
      enableSorting: true,
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Station Code
        </div>
      ),
    },

    {
      accessorKey: 'network',
      enableSorting: true,
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Network
        </div>
      ),
    },
    {
      accessorKey: 'city',
      enableSorting: true,
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          City
        </div>
      ),
    },
    {
      accessorKey: 'province',
      enableSorting: true,
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Province
        </div>
      ),
    },
    {
      accessorKey: 'start_date',
      header: 'Instalation Date',
      enableSorting: true,
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <button
          className="text-teal-700 hover:text-teal-900 cursor-pointer flex items-center justify-center"
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
              className="text-xl text-teal-700 hover:text-teal-900 cursor-pointer"
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
              className="text-xl text-teal-700 hover:text-teal-900 cursor-pointer"
              onClick={() => openEditStation(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>

          {/* <div className="relative group">
            <FaTrash
              className="text-xl text-rose-700 hover:text-rose-900 cursor-pointer"
              onClick={() => openDeleteStation(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Delete
            </span>
          </div> */}
        </div>
      ),
    },
  ];

  const colStyling = {
    station_code: 'font-bold text-teal-800',
    category: 'text-gray-700',
    city: 'text-gray-700',
    province: 'text-gray-700',
    description: 'text-gray-700',
  };

  return (
    <div className="w-full max-w-full p-4">
      <div className="relative w-full h-full">
        <Table
          columns={columns}
          dataTable={dataTable}
          fetchData={fetchData}
          colStyling={colStyling}
          createButton={true}
          createFunction={openCreateStation}
          createName={'Create Station'}
          categories={categories}
          searchPlaceholder={'Search Station...'}
        />
      </div>
    </div>
  );
};

export default StationTable;
