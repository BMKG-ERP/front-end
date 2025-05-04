'use client';

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
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

const RechartsHealthChart = ({ data, selectedChannels }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { labels: [], datasets: [] };

    const formattedData = data.map((item) => ({
      ...item,
      health_status:
        item.health_status === null ||
        item.health_status === '' ||
        parseFloat(item.health_status) === 0
          ? 0
          : parseFloat(item.health_status),
      channel: item.channel || 'Other',
      report_timestamp: new Date(item.report_timestamp).toISOString(),
    }));

    const labels = formattedData.map((item) =>
      new Date(item.report_timestamp).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      })
    );

    let datasets = selectedChannels.map((channel) => {
      const channelData = formattedData.filter(
        (item) => item.channel === channel
      );

      return {
        label: channel,
        data: channelData.map((item) => item.health_status ?? 0),
        borderColor: channelColors[channel] || '#999999',
        fill: false,
        tension: 0,
      };
    });

    // If no channels selected, provide a placeholder empty dataset
    if (datasets.length === 0) {
      datasets = [
        {
          label: 'No Data',
          data: new Array(labels.length).fill(null),
          borderColor: '#ccc',
          borderDash: [5, 5],
          fill: false,
          tension: 0,
        },
      ];
    }

    return {
      labels,
      datasets,
    };
  }, [data, selectedChannels]);

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        min: 0,
      },
    },
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  if (!chartData.labels.length || !chartData.datasets.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RechartsHealthChart;
