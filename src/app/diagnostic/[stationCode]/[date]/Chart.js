'use client';

import React from 'react';
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

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RechartsHealthChart = ({ data, selectedChannels }) => {
  const channelColors = {
    SHN: '#FF6384', // Red
    SHZ: '#36A2EB', // Blue
    SHE: '#4BC0C0', // Green
    Other: '#FFCE56', // Yellow
  };

  // Format the data
  const formattedData = data.map((item) => ({
    ...item,
    health_status:
      item.health_status === null ||
      item.health_status === '' ||
      parseFloat(item.health_status) === 0
        ? 0
        : parseFloat(item.health_status),
    channel: item.channel || 'Other',
  }));

  const channelGroups = ['SHN', 'SHZ', 'SHE', 'Other'];

  // Prepare the data for Chart.js
  const chartData = {
    labels: [], // Timestamps
    datasets: [], // Data sets for each channel
  };

  channelGroups.forEach((channel) => {
    if (selectedChannels.includes(channel)) {
      const channelData = formattedData.filter(
        (item) => item.channel === channel
      );

      // Get the timestamps for the x-axis
      if (chartData.labels.length === 0) {
        chartData.labels = channelData.map((item) =>
          new Date(item.report_timestamp).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'UTC',
          })
        );
      }

      // Prepare the dataset for this channel
      chartData.datasets.push({
        label: channel,
        data: channelData.map((item) => item.health_status),
        borderColor: channelColors[channel],
        fill: false,
        tension: 0.1, // Line smoothing
      });
    }
  });

  // Chart.js options
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
      duration: 0, // Disable animations for better performance
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

  return (
    <div className="space-y-4">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RechartsHealthChart;
