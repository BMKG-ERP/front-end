import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
  IoStarOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from 'react-icons/io5';

// const evaluationData = [
//   { name: 'Excellent', value: 357, color: '#4CAF50', icon: <IoStarOutline /> },
//   {
//     name: 'Good',
//     value: 106,
//     color: '#FFC107',
//     icon: <IoCheckmarkCircleOutline />,
//   },
//   { name: 'Poor', value: 44, color: '#F44336', icon: <IoCloseCircleOutline /> },
// ];

const EvaluationData = () => {
  const [chartSize, setChartSize] = useState(500);
  const [evaluationData, setEvaluationData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvaluationData = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/stations/evaluation-status`
      );
      const data = await response.json();

      console.log('API Response:', data); // Debugging

      setEvaluationData(data.data || []); // Ensure data is an array
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Handle window resize
    const handleResize = () => {
      setChartSize(window.innerWidth < 768 ? 300 : 500);
    };

    handleResize(); // Set initial chart size
    fetchEvaluationData(); // Fetch data when component mounts & when `page` changes

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // ✅

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-4xl my-4 font-bold">Evaluation Status</h2>

      {/* Pie Chart */}
      <div className="flex items-center justify-center">
        <PieChart width={chartSize} height={chartSize}>
          <Pie
            data={evaluationData}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="90%"
            label
            dataKey="value"
          >
            {evaluationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xl font-bold font-sans"
          >
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-bold text-black font-sans"
            >
              <tspan x="50%" dy="-0.3em">
                Evaluation
              </tspan>
              <tspan x="50%" dy="1.2em">
                Independent Maintenance Station
              </tspan>
            </text>
          </text>
        </PieChart>
      </div>

      {/* Legend Section */}
      <div className="w-full max-w-sm mt-5 mx-auto">
        {evaluationData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-blue-200"
          >
            <div className="flex items-center gap-2">
              <span style={{ color: item.color }} className="text-xl">
                {item.icon}
              </span>
              <span className="font-semibold text-lg">{item.name}</span>
            </div>
            <span className="text-gray-900 font-bold text-xl">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationData;
