import React, { useState } from 'react';
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
import FilterDropdown from './DropDown';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HealthStatusChart = ({ data }) => {
  const allChannels = ['SHN', 'SHZ', 'SHE'];
  const [selectedChannels, setSelectedChannels] = useState(allChannels);

  const filteredData = data.filter(
    (item) => item.channel && selectedChannels.includes(item.channel)
  );

  const formattedTimestamps = filteredData.map((item) =>
    new Date(item.report_timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })
  );

  const channelGroups = {};
  filteredData.forEach((item) => {
    const time = new Date(item.report_timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });

    if (!channelGroups[item.channel]) {
      channelGroups[item.channel] = {};
    }
    channelGroups[item.channel][time] = parseFloat(item.health_status);
  });

  const channelColors = {
    SHN: 'rgb(255, 99, 132)',
    SHZ: 'rgb(54, 162, 235)',
    SHE: 'rgb(75, 192, 192)',
  };

  const datasets = Object.entries(channelGroups)
    .map(([channel, values]) => {
      const color = channelColors[channel];
      const dataPoints = formattedTimestamps.map((t) =>
        values.hasOwnProperty(t) ? values[t] : null
      );

      // Prevent dataset with all nulls
      if (dataPoints.every((point) => point === null)) {
        return null;
      }

      return {
        label: channel,
        data: dataPoints,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: false,
        tension: 0.1,
      };
    })
    .filter(Boolean);

  const chartData = {
    labels: formattedTimestamps,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Health Status per Channel',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time (HH:MM:SS)' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Health Status' },
      },
    },
  };

  return (
    <div className="space-y-4">
      <FilterDropdown
        allOptions={allChannels}
        selectedOptions={selectedChannels}
        setSelectedOptions={setSelectedChannels}
      />
      <Line data={chartData} options={options} />
    </div>
  );
};

export default HealthStatusChart;
