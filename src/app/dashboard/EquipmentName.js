'use client';
import React, { useState, useEffect } from 'react';

const SummaryDisplay = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [summaryHealthData, setSummaryHealthData] = useState([]);

  const fetchSummaryName = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_LOCAL_API +
          process.env.NEXT_PUBLIC_EQUIPMENT_SUMMARY_NAME_API
        }`
      );
      const result = await response.json();

      if (result.data) {
        setSummaryData(result.data.sort((a, b) => b.item_count - a.item_count));
      } else {
        setSummaryData([]);
      }

      //   setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      //   setLoading(false);
    }
  };

  const fetchSummaryEquipmentHealth = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_LOCAL_API +
          process.env.NEXT_PUBLIC_DAILY_REPORT_SUMMARY_EQUIPMENT_HEALTH_API
        }`
      );
      const result = await response.json();

      if (result.data) {
        setSummaryHealthData(
          result.data.sort((a, b) => b.percentage - a.percentage)
        );
      } else {
        setSummaryHealthData([]);
      }

      //   setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      //   setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryName();
    fetchSummaryEquipmentHealth();
  }, []); // ✅

  // Calculate the total sum of item_count
  const totalItemCount = summaryData.reduce(
    (acc, entry) => acc + entry.item_count,
    0
  );

  return (
    <div className="p-4 top-0 flex flex-col">
      {/* Grid for summary data including Active Equipment */}
      <h1>Total Number Of</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Active Equipment Box */}
        <div className="border rounded-lg p-4 shadow-lg w-full">
          <div className="font-bold text-lg">Active Equipment</div>
          <div className="text-sm text-gray-700">
            Total Count: {totalItemCount}
          </div>
        </div>

        {/* Grid for other summary data */}
        {summaryData.map((entry, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-lg w-full"
            style={{ minWidth: '200px' }}
          >
            <div className="font-bold text-lg">{entry.item}</div>
            <div className="text-sm text-gray-700">
              Value: {entry.item_count}
            </div>
          </div>
        ))}
      </div>

      {/* Grid for summary health data with progress bars */}
      <h2 className="mt-8 font-bold text-xl">Equipment Health</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
        {summaryHealthData.map((entry, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-lg w-full"
            style={{ minWidth: '200px' }}
          >
            <div className="font-bold text-lg">{entry.item} Health</div>

            {/* Progress bar with 0% and 100% labels */}
            <div className="flex items-center">
              <span className="text-sm text-gray-700">0%</span>
              <div className="w-full bg-gray-200 rounded-full h-4 mx-2">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${entry.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700">100%</span>
            </div>

            <div className="text-sm text-gray-700 mt-2">
              {entry.percentage}% Health
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryDisplay;
