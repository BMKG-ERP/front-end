'use client';

import { useState, useEffect, useCallback } from 'react';
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

        // Add filter for equipment_name (Seismometer or others)

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
    [station_code, report_date] // Dependencies include equipment name filter
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
      accessorKey: 'report_timestamp',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Date
        </div>
      ),
      cell: ({ row }) => {
        const value = row.original.report_timestamp;
        if (!value) return '-';

        const date = new Date(value);

        const options = {
          timeZone: 'UTC', // Keep it in UTC timezone
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };

        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
          date
        );

        return formattedDate;
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
    },
    {
      accessorKey: 'diagnosis',
      header: 'Diagnosis',
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
