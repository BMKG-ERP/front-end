import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
  IoStarOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from 'react-icons/io5';

const evaluationData = [
  { name: 'Excellent', value: 357, color: '#4CAF50', icon: <IoStarOutline /> },
  {
    name: 'Good',
    value: 106,
    color: '#FFC107',
    icon: <IoCheckmarkCircleOutline />,
  },
  { name: 'Poor', value: 44, color: '#F44336', icon: <IoCloseCircleOutline /> },
];

const colors = ['#4CAF50', '#FFC107', '#F44336'];

const EvaluationData = () => {
  return (
    <div className="flex min-w-full flex-col items-center">
      <div className="flex min-w-full flex-col items-center">
        <div className="font-bold  font-sans flex">
          <h2 className="flex text-4xl my-auto py-4 font-bold">
            Evaluation Status
          </h2>
        </div>
        <div className="flex font-bold font-sans items-center justify-center m-auto">
          <PieChart width={500} height={500}>
            <Pie
              data={evaluationData}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="90%"
              labelLine={true}
              label={true}
              name="Evaluation independent maintenance station"
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
              className="text-xl font-bold font-sans bg-black"
            >
              Evaluation Independent Maintenance Station
            </text>
          </PieChart>
        </div>
      </div>
      <div className="w-full max-w-sm mt-5 mx-auto">
        {evaluationData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-blue-200"
          >
            <div className="flex items-center gap-2">
              <span style={{ color: item.color }} className={`text-xl`}>
                {item.icon}
              </span>
              <span className={`font-semibold text-lg`}>{item.name}</span>
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
