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
      <h2 className="text-lg font-bold">Evaluation Status</h2>
      <PieChart width={600} height={600}>
        <Pie
          data={evaluationData}
          cx={300}
          cy={300}
          innerRadius={120}
          outerRadius={220}
          paddingAngle={2}
          dataKey="value"
        >
          {evaluationData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default EvaluationData;
