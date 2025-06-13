'use client';

import DailyReportTable from './DailyReportTable';
import StationHealthChart from './StationHealthChart';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-date-range';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function DiagnosticDetailPage() {
  const router = useRouter();
  const params = useParams();
  const stationCode = params.stationCode;

  const [loading, setLoading] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tableData, setTableData] = useState([]);

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

  const [tempDateRange, setTempDateRange] = useState(dateRange);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const handleFilter = () => {
    setDateRange(tempDateRange);
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
        url.searchParams.append('station_id', stationCode);
        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);
        url.searchParams.append('start_date', start_date);
        url.searchParams.append('end_date', end_date);

        const response = await fetch(url.toString());
        const result = await response.json();

        if (!result.error && result.code === 200) {
          setTableData(result.data || []);
          return {
            data: result.data || [],
            pagination: result.pagination,
          };
        } else {
          console.error('Error fetching stations:', result.message);
          setTableData([]);
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
        setTableData([]);
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
    [dateRange, stationCode]
  );

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="z-10 h-full w-full flex justify-center">
      <div className="w-full h-full max-w-[1800px] mt-10 border-x-2 border-gray-300 bg-white flex flex-col items-center py-4 px-4 md:px-8 lg:px-12">
        <div className="w-full flex items-start mb-4">
          <button
            onClick={() => router.back()}
            className="text-teal-700 hover:text-teal-500 flex items-center text-md"
          >
            ← Back to Diagnostic Page
          </button>
        </div>
        <h1 className="text-2xl font-bold">
          Report Detail Station: {stationCode}
        </h1>

        {/* Shared Date Filter Controls */}
        <div className="w-full max-w-full p-4">
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
                      setTempDateRange([item.selection]);
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={tempDateRange}
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
        </div>

        <div className="w-full h-full mx-auto mb-10 mt-5">
          <div className="w-full mb-6">
            <StationHealthChart data={tableData} stationCode={stationCode} />
          </div>
          
          <div className="flex flex-col items-center mb-5 justify-center z-20 w-full h-[300px] md:h-full">
            <DailyReportTable 
              station_code={stationCode} 
              data={tableData}
              fetchData={fetchData}
              pagination={pagination}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticDetailPage;
