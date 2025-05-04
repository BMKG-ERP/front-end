'use client';

import HealthStatusChart from './Chart';
import DailyHealthTable from './DailyHealthStatus';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { volumeHigh } from 'ionicons/icons';

// import DailyReportTable from './DailyReportTable';

function DiagnosticDetailPage({ params }) {
  const { stationCode, date } = params;

  const router = useRouter();

  const [data, setData] = useState([]);
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
        // Normalize health_status values
        const allowedChannels = ['SHN', 'SHZ', 'SHE'];

        const normalizedData = result.data.map((item) => {
          const rawHealthStatus = parseFloat(item.health_status);
          return {
            ...item,
            channel: allowedChannels.includes(item.channel)
              ? item.channel
              : 'Other',
            health_status:
              item.health_status === null ||
              item.health_status === '' ||
              isNaN(rawHealthStatus)
                ? 0
                : rawHealthStatus,
          };
        });

        console.log(normalizedData);

        setData(normalizedData);
      } else {
        console.error('Error fetching stations:', result.message);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <h1 className="text-2xl font-bold">
          Report Detail Station: {stationCode}
          Selected Date: {date}
        </h1>
        <div className="w-full">
          <HealthStatusChart data={data} />
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
