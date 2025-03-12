import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const evaluationData = [
  { name: 'Excellent', value: 357, color: '#4CAF50' },
  { name: 'Good', value: 106, color: '#FFC107' },
  { name: 'Poor', value: 44, color: '#F44336' },
];

const colors = ['#4CAF50', '#FFC107', '#F44336'];

const EvaluationData = () => {
  return (
    <div className="flex min-w-full flex-col items-center">
      <div className="font-bold  font-sans flex">
        <h2 className="flex text-4xl my-auto py-4 font-bold">
          Evaluation Status
        </h2>
      </div>
      <div className="flex font-bold border-white border-2 font-sans items-center justify-center m-auto">
        <PieChart width={600} height={600}>
          <Pie
            data={evaluationData}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="90%"
            labelLine={true}
            label={true}
            name="Evaluation independent maintenance station"
            // paddingAngle="2"
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
            Evaluation Independent Maintenance Station
          </text>
        </PieChart>
      </div>
    </div>
  );
};

export default EvaluationData;
