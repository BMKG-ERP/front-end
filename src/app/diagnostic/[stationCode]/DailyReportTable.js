'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye } from 'react-icons/fa';
import { DateRange } from 'react-date-range';
import { addDays, format } from 'date-fns';

import Table from '@/components/table/Table';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DailyReportTable = ({ station_code }) => {
  const [loading, setLoading] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [popupRow, setPopupRow] = useState(null); // store the selected row for the popup

  const handleRoute = (equipment) => {
    if (!popupRow) return;
    const { station_code, report_date } = popupRow.original;
    router.push(`/diagnostic/${station_code}/${equipment}/${report_date}`);
    setPopupRow(null); // close popup
  };

  // Default date range: today and 6 days ago
  const today = new Date();
  const sevenDaysAgo = addDays(today, -6);

  const [dateRange, setDateRange] = useState([
    {
      startDate: sevenDaysAgo,
      endDate: today,
      key: 'selection',
    },
  ]);

  const [tempDateRange, setTempDateRange] = useState(dateRange); // Temporary date range for user input

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const [tableData, setTableData] = useState([]);
  const router = useRouter();

  const handleFilter = () => {
    setDateRange(tempDateRange); // Apply the selected date range
    setFilterApplied(true);
    setShowCalendar(false);
  };

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

      const formatDate = (date) => date.toISOString().split('T')[0];

      const start_date = customStartDate || formatDate(dateRange[0].startDate);
      const end_date = customEndDate || formatDate(dateRange[0].endDate);

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
    [dateRange, station_code]
  );

  const fetchParams = useMemo(() => {
    if (filterApplied) {
      const formatDate = (date) => date.toISOString().split('T')[0];
      return {
        customStartDate: formatDate(dateRange[0].startDate),
        customEndDate: formatDate(dateRange[0].endDate),
      };
    }
    return {};
  }, [dateRange, filterApplied]);

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
        if (score === null || score === undefined) {
          return 'Empty';
        }
        if (typeof score === 'number') {
          return score.toFixed(2);
        }
        return score;
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
              onClick={() => setPopupRow(row)} // open popup and save current row
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
    equipment_id: 'font-bold text-blue-950',
    status: 'font-bold text-blue-950',
  };

  return (
    <div className="w-full max-w-full p-4">
      <div className="relative w-full h-full">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <div className="relative">
            <button
              className="bg-gray-100 border border-gray-300 rounded px-4 py-2"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {`${format(tempDateRange[0].startDate, 'yyyy-MM-dd')} to ${format(
                tempDateRange[0].endDate,
                'yyyy-MM-dd'
              )}`}
            </button>
            {showCalendar && (
              <div className="absolute z-50 mt-2 shadow-md">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    if (item.selection.endDate > today) {
                      item.selection.endDate = today;
                    }
                    setTempDateRange([item.selection]); // Update temporary date range
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={tempDateRange} // Use the temporary date range here
                  maxDate={today}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleFilter}
            className="bg-teal-800 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded"
          >
            Apply Filter
          </button>
        </div>

        <Table
          columns={columns}
          dataTable={true}
          fetchData={fetchData}
          colStyling={colStyling}
          isSearch={false}
          fetchParams={fetchParams}
        />
        {popupRow && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-xs w-full">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Select Equipment
              </h3>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  className="px-4 py-2 bg-teal-800 text-white rounded hover:bg-teal-600"
                  onClick={() => handleRoute('Seismometer')}
                >
                  Seismometer
                </button>
                <button
                  className="px-4 py-2 bg-teal-800 text-white rounded hover:bg-teal-600"
                  onClick={() => handleRoute('Battery')}
                >
                  Battery
                </button>
              </div>
              <button
                onClick={() => setPopupRow(null)}
                className="text-sm text-gray-500 hover:text-gray-800 block mx-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReportTable;
