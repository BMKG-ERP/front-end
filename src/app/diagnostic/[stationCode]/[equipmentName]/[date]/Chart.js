'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const channelColors = {
  SHN: '#FF6384',
  SHZ: '#36A2EB',
  SHE: '#4BC0C0',
  Other: '#FFCE56',
};

const RechartsHealthChart = ({ data, selectedChannels, equipmentName }) => {
  const [isLoading, setIsLoading] = useState(true);

  // useMemo to format data only once based on new data or channels
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { datasets: [] };

    const formattedData = data.map((item) => ({
      x: new Date(item.report_timestamp), // important: actual Date object
      y:
        item.health_status === null ||
        item.health_status === '' ||
        parseFloat(item.health_status) === 0
          ? 0
          : parseFloat(item.health_status),
      channel: item.channel || 'Other',
    }));

    let datasets = selectedChannels.map((channel) => {
      const channelData = formattedData.filter(
        (item) => item.channel === channel
      );

      return {
        label: channel,
        data: channelData.map(({ x, y }) => ({ x, y })),
        borderColor: channelColors[channel] || '#999999',
        fill: false,
        tension: 0,
      };
    });

    if (datasets.length === 0) {
      datasets = [
        {
          label: 'No Data',
          data: [],
          borderColor: '#ccc',
          borderDash: [5, 5],
          fill: false,
          tension: 0,
        },
      ];
    }

    return { datasets };
  }, [data, selectedChannels]);

  // Chart.js options
  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          tooltipFormat: 'HH:mm:ss',
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        ticks: {
          callback: function (value) {
            const date = new Date(value);
            return date.toISOString().slice(11, 19); // Show HH:mm:ss UTC
          },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        position: 'top',
        display: equipmentName === 'Seismometer', // Hide legend if not Seismometer
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  useEffect(() => {
    // Trigger only once when the component mounts and data is updated
    if (data && data.length > 0) {
      setIsLoading(false); // Stop loading once data is ready
    }
  }, [data]); // Depend on data, so it updates only when data changes

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="w-full h-[300px] flex justify-center items-center">
          <span>No Data</span>
        </div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default RechartsHealthChart;
