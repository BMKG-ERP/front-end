'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const StationHealthChart = ({ data, stationCode }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Process the data to create a chart-friendly format
    const processedData = data.map((item) => ({
      date: item.report_date,
      healthScore: item.health_score || 0,
    }));
    
    // Sort by date
    processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return processedData;
  }, [data]);

  if (!data) {
    return (
      <div className="w-full h-[400px] p-4 bg-white rounded-xl shadow-lg flex items-center justify-center">
        <div>Loading chart...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[400px] p-4 bg-white rounded-xl shadow-lg flex items-center justify-center">
        <div>No chart data available for this station</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-xl shadow-lg">
      <h3 className="text-lg font-bold mb-4 text-center">
        Health Score Trend for Station {stationCode}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[0, 100]}
            label={{ value: 'Health Score', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => [value, 'Health Score']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="healthScore"
            stroke="#0891b2"
            strokeWidth={3}
            name="Health Score"
            dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StationHealthChart; 