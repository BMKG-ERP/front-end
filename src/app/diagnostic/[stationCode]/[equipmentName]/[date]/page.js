'use client';

import RechartsHealthChart from './Chart'; // Now uses the new Recharts chart
import DailyHealthTable from './DailyHealthStatus';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterDropdown from './DropDown'; // Import the dropdown here

function DiagnosticDetailPage({ params }) {
  const { stationCode, date } = params;
  const router = useRouter();

  const equipmentName = params.equipmentName ?? 'Seismometer';

  const seismoChannels = ['SHN', 'SHZ', 'SHE'];
  const nonSeismoChannels = ['Other'];

  // Available channels based on the equipment
  const availableChannels =
    equipmentName === 'Seismometer' ? seismoChannels : nonSeismoChannels;

  const [data, setData] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState(availableChannels);
  const page = 1;
  const limit = -1;

  const fetchData = async () => {
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_LOCAL_API}${process.env.NEXT_PUBLIC_DAILY_HEALTH_STATUS_API}${process.env.NEXT_PUBLIC_DAILY_HEALTH_STATUS_BY_STATION_API}`
      );
      url.searchParams.append('station_code', stationCode);
      url.searchParams.append('page', page);
      url.searchParams.append('limit', limit);
      url.searchParams.append('date', date);

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.error && result.code === 200) {
        // Normalize health_status values and handle empty diagnosis and channels
        const normalizedData = result.data.map((item) => {
          // Parse the report_timestamp as a Date object
          const date = new Date(item.report_timestamp);

          // Check if the date is valid
          if (isNaN(date)) {
            console.warn('Invalid report_timestamp:', item.report_timestamp);
            return {
              ...item,
              report_timestamp: null, // Set invalid timestamp as null or handle accordingly
            };
          }

          // Normalize the health_status, diagnosis, and channel
          return {
            ...item,
            health_status:
              item.health_status === null ||
              item.health_status === '' ||
              parseInt(item.health_status) === 0
                ? 0
                : parseInt(item.health_status),
            diagnosis:
              item.diagnosis === null || item.diagnosis === ''
                ? ''
                : item.diagnosis,
            channel: item.channel === null ? 'Other' : item.channel,
            // Convert to UTC and return as an ISO string (no timezone adjustment)
            report_timestamp: date.toISOString(),
          };
        });

        const filteredData = normalizedData.filter((item) => {
          if (equipmentName === 'Seismometer') {
            return (
              selectedChannels.includes(item.channel) &&
              item.channel !== 'Other'
            );
          } else {
            return !['SHE', 'SHZ', 'SHN'].includes(item.channel);
          }
        });

        const validData = filteredData.filter(
          (item) =>
            item.health_status !== undefined && item.channel !== undefined
        );

        if (validData.length === 0) {
          console.error('No valid data to display on the chart.');
          setData([]);
          return;
        }

        setData(validData);
      } else {
        console.error('Error fetching stations:', result.message);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  useEffect(() => {
    setSelectedChannels(availableChannels);
    fetchData();
  }, [equipmentName]);

  return (
    <div className="z-10 h-full w-full flex justify-center">
      <div className="w-full h-full max-w-[1800px] mt-10 border-x-2 border-gray-300 bg-white flex flex-col items-center py-4 px-4 md:px-8 lg:px-12">
        <div className="w-full flex items-start mb-4">
          <button
            onClick={() => router.back()}
            className="text-teal-700 hover:text-teal-500 flex items-center text-md"
          >
            ← Back
          </button>
        </div>
        <div className="items-center flex flex-col justify-between font-bold">
          <h1 className="text-2xl  font-bold">
            Report Detail Station: {stationCode}
            <br />
          </h1>
          <h1 className="text-2xl  font-bold">{equipmentName}</h1>
          <h1 className="text-2xl  font-bold">{date}</h1>
        </div>

        {/* Conditionally render FilterDropdown based on equipmentName */}
        {equipmentName === 'Seismometer' && (
          <FilterDropdown
            allOptions={seismoChannels}
            selectedOptions={selectedChannels}
            setSelectedOptions={setSelectedChannels}
          />
        )}

        <div className="w-full">
          <RechartsHealthChart
            data={data}
            selectedChannels={selectedChannels}
            equipmentName={equipmentName}
          />
        </div>

        <div className="w-full h-full mx-auto mb-10 mt-5">
          <div className="flex flex-col items-center mb-5 justify-center z-20 w-full h-[300px] md:h-full">
            <DailyHealthTable station_code={stationCode} report_date={date} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticDetailPage;
