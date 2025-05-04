'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

import Table from '@/components/table/Table';

const DailyReportTable = ({ station_code }) => {
  const [loading, setLoading] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const [tableData, setTableData] = useState([]);
  const handleFilter = () => {
    setFilterApplied(true); // Mark the filter as applied when the button is clicked
  };
  const dataTable = true;

  const router = useRouter();

  const fetchData = useCallback(
    async ({
      sort = '',
      order = '',
      page = 1,
      limit = -1,
      search = '',
      customStartDate = '',
      customEndDate = '',
    } = {}) => {
      setLoading(true);

      // Default to current week if no custom dates
      const today = new Date();
      const day = today.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const formatDate = (date) => date.toISOString().split('T')[0];

      const start_date = customStartDate || formatDate(monday);
      const end_date = customEndDate || formatDate(sunday);

      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_LOCAL_API}${process.env.NEXT_PUBLIC_DAILY_REPORT_API}${process.env.NEXT_PUBLIC_DAILY_REPORT_EQUIPMENT_HEALTH_API}`
        );
        url.searchParams.append('station_id', station_code);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        url.searchParams.append('start_date', start_date);
        url.searchParams.append('end_date', end_date);

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
    [] // still okay if you rely on endDate internally or pass it via props
  );

  const fetchParams = useMemo(() => {
    if (filterApplied) {
      return {
        customStartDate: startDate,
        customEndDate: endDate,
      };
    }
    return {}; // Empty object if no filter has been applied yet
  }, [startDate, endDate, filterApplied]);

  const columns = [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => {
        return (pagination.page - 1) * pagination.limit + row.index + 1;
      },
    },

    {
      accessorKey: 'report_date',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Date
        </div>
      ),
    },
    {
      accessorKey: 'health_category',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Health Category
        </div>
      ),
    },
    {
      accessorKey: 'health_score',
      header: 'Health Score',
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
                router.push(
                  `/diagnostic/${row.original.station_code}/${row.original.report_date}`
                )
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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="start-date" className="text-sm font-medium">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              className="border border-gray-300 rounded p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-date" className="text-sm font-medium">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              className="border border-gray-300 rounded p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
          >
            Apply Filter
          </button>
        </div>

        <Table
          columns={columns}
          dataTable={dataTable}
          // data={tableData}
          initialData={tableData}
          fetchData={fetchData}
          colStyling={colStyling}
          isSearch={false}
          fetchParams={fetchParams}
        />
      </div>
    </div>
  );
};
export default DailyReportTable;
