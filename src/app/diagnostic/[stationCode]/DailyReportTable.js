'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye } from 'react-icons/fa';
import { DateRange } from 'react-date-range';
import { addDays, format } from 'date-fns';

import Table from '@/components/table/Table';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DailyReportTable = ({ station_code, data, fetchData, pagination }) => {
  const [popupRow, setPopupRow] = useState(null);
  const router = useRouter();

  const handleRoute = (equipment) => {
    if (!popupRow) return;
    const { station_code, report_date } = popupRow.original;
    router.push(`/diagnostic/${station_code}/${equipment}/${report_date}`);
    setPopupRow(null);
  };

  const columns = [
    {
      id: 'no',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          No
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">
            {(pagination.page - 1) * pagination.limit + row.index + 1}
          </div>
        );
      },
      size: 60,
    },
    {
      accessorKey: 'report_date',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Date
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="text-center">
          {getValue()}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'health_category',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Health Category
        </div>
      ),
      cell: ({ getValue }) => (
        <div className="text-center">
          {getValue()}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: 'health_score',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Health Score
        </div>
      ),
      cell: ({ row }) => {
        const score = row.original.health_score;
        let displayValue;
        if (score === null || score === undefined) {
          displayValue = '-';
        } else if (typeof score === 'number') {
          displayValue = score.toFixed(2);
        } else {
          displayValue = score;
        }
        return (
          <div className="text-center">
            {displayValue}
          </div>
        );
      },
      size: 120,
    },
    {
      id: 'actions',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Actions
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex gap-4 items-center justify-center">
          <div className="relative group">
            <FaEye
              className="text-xl text-cyan-700 hover:text-cyan-900 cursor-pointer"
              onClick={() => setPopupRow(row)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </span>
          </div>
        </div>
      ),
      size: 100,
    },
  ];

  const colStyling = {
    equipment_id: 'font-bold text-blue-950',
    status: 'font-bold text-blue-950',
  };

  return (
    <div className="w-full max-w-full p-4">
      <div className="relative w-full h-full">
        <Table
          columns={columns}
          dataTable={true}
          fetchData={fetchData}
          colStyling={colStyling}
          isSearch={false}
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
