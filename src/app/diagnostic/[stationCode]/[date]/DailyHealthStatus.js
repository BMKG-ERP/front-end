'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

import Table from '@/components/table/Table';

const DailyHealthTable = ({ station_code, report_date }) => {
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const dataTable = true;

  const router = useRouter();

  const fetchData = useCallback(
    async (
      sort = '',
      order = '',
      page = 1,
      limit = -1,
      search = '',
      customStartDate = '',
      customEndDate = ''
    ) => {
      setLoading(true);

      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_LOCAL_API}${process.env.NEXT_PUBLIC_DAILY_HEALTH_STATUS_API}${process.env.NEXT_PUBLIC_DAILY_HEALTH_STATUS_BY_STATION_API}`
        );
        url.searchParams.append('station_code', station_code);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        url.searchParams.append('date', report_date);

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
      accessorKey: 'timestamp',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Date
        </div>
      ),
      cell: ({ row }) => {
        const value = row.original.timestamp;
        if (!value) return '-';

        const date = new Date(value);

        const pad = (n) => n.toString().padStart(2, '0');

        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
      },
    },
    {
      accessorKey: 'channel',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Channel
        </div>
      ),
    },
    {
      accessorKey: 'health_status',
      header: 'Health Status',
      //   cell: ({ row }) => {
      //     const score = row.original.health_score;
      //     if (score === null || score === undefined) return 'Empty';
      //     if (score < 50) return 'Poor';
      //     if (score < 90) return 'Fair';
      //     return 'Excellent';
      //   },
    },
    {
      accessorKey: 'diagnosis',
      header: 'Diagnosis',
      //   cell: ({ row }) => {
      //     const score = row.original.health_score;
      //     if (score === null || score === undefined) return 'Empty';
      //     if (score < 50) return 'Poor';
      //     if (score < 90) return 'Fair';
      //     return 'Excellent';
      //   },
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
          isSearch={false}
        />
      </div>
    </div>
  );
};
export default DailyHealthTable;
