'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

import Table from '@/components/table/Table';

const DiagnosticTable = ({}) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const dataTable = true;

  const router = useRouter();

  const fetchData = useCallback(
    async (sort = '', order = '', page = 1, limit = -1, search = '') => {
      setLoading(true);
      try {
        const url = new URL(
          `${
            process.env.NEXT_PUBLIC_LOCAL_API +
            process.env.NEXT_PUBLIC_DAILY_REPORT_API +
            process.env.NEXT_PUBLIC_DAILY_REPORT_LIST_STATION_API
          }`
        );

        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);

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
      } finally {
        setLoading(false);
      }
    },
    []
  );

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
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Station Code
        </div>
      ),
    },
    {
      accessorKey: 'network',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Network
        </div>
      ),
    },
    {
      accessorKey: 'health_score',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Health Score
        </div>
      ),
    },
    {
      id: 'health_status',
      header: 'Health Status',
      cell: ({ row }) => {
        const score = row.original.health_score;
        if (score === null || score === undefined) return 'Empty';
        if (score < 50) return 'Poor';
        if (score < 90) return 'Fair';
        return 'Excellent';
      },
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
                router.push(`/diagnostic/${row.original.station_code}`)
              }
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View
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

  return (
    <div className="w-full max-w-full p-4">
      <div className="relative w-full h-full">
        <Table
          columns={columns}
          dataTable={dataTable}
          fetchData={fetchData}
          colStyling={colStyling}
          // createButton={true}
          // createFunction={openCreateEquipment}
          //   fontSize="12"
        />
      </div>
    </div>
  );
};
export default DiagnosticTable;
