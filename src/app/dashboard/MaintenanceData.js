import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const maintenanceData = [
  { region: 'Aceh Besar', Excellent: 92, Good: 8, Poor: 0 },
  { region: 'Deli Serdang', Excellent: 58, Good: 25, Poor: 16 },
  { region: 'Nias', Excellent: 66, Good: 22, Poor: 11 },
  { region: 'Lampung', Excellent: 72, Good: 16, Poor: 11 },
  { region: 'Bandung', Excellent: 0, Good: 7, Poor: 93 },
  { region: 'Banjarmasin', Excellent: 20, Good: 30, Poor: 50 },
  { region: 'Denpasar', Excellent: 40, Good: 30, Poor: 30 },
  { region: 'Ternate', Excellent: 10, Good: 10, Poor: 80 },
  { region: 'Ambon', Excellent: 50, Good: 25, Poor: 25 },
  { region: 'Aceh Besar', Excellent: 92, Good: 8, Poor: 0 },
  { region: 'Deli Serdang', Excellent: 58, Good: 25, Poor: 16 },
  { region: 'Nias', Excellent: 66, Good: 22, Poor: 11 },
  { region: 'Lampung', Excellent: 72, Good: 16, Poor: 11 },
  { region: 'Bandung', Excellent: 0, Good: 7, Poor: 93 },
  { region: 'Banjarmasin', Excellent: 20, Good: 30, Poor: 50 },
  { region: 'Denpasar', Excellent: 40, Good: 30, Poor: 30 },
  { region: 'Ternate', Excellent: 10, Good: 10, Poor: 80 },
  { region: 'Ambon', Excellent: 50, Good: 25, Poor: 25 },
  { region: 'Aceh Besar', Excellent: 92, Good: 8, Poor: 0 },
  { region: 'Deli Serdang', Excellent: 58, Good: 25, Poor: 16 },
  { region: 'Nias', Excellent: 66, Good: 22, Poor: 11 },
  { region: 'Lampung', Excellent: 72, Good: 16, Poor: 11 },
  { region: 'Bandung', Excellent: 0, Good: 7, Poor: 93 },
  { region: 'Banjarmasin', Excellent: 20, Good: 30, Poor: 50 },
  { region: 'Denpasar', Excellent: 40, Good: 30, Poor: 30 },
  { region: 'Ternate', Excellent: 10, Good: 10, Poor: 80 },
  { region: 'Ambon', Excellent: 50, Good: 25, Poor: 25 },
  { region: 'Aceh Besar', Excellent: 92, Good: 8, Poor: 0 },
  { region: 'Deli Serdang', Excellent: 58, Good: 25, Poor: 16 },
  { region: 'Nias', Excellent: 66, Good: 22, Poor: 11 },
  { region: 'Lampung', Excellent: 72, Good: 16, Poor: 11 },
  { region: 'Bandung', Excellent: 0, Good: 7, Poor: 93 },
  { region: 'Banjarmasin', Excellent: 20, Good: 30, Poor: 50 },
  { region: 'Denpasar', Excellent: 40, Good: 30, Poor: 30 },
  { region: 'Ternate', Excellent: 10, Good: 10, Poor: 80 },
  { region: 'Ambon', Excellent: 50, Good: 25, Poor: 25 },
];

const colors = ['#4CAF50', '#FFC107', '#F44336'];

const MaintenanceData = () => {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <h2 className="text-lg font-bold">Independent Maintenance</h2>
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 h-full w-full">
        {maintenanceData.length > 6 ? (
          <>
            {/* First Column */}
            <div className="h-full w-full flex-grow">
              <ResponsiveContainer width="100%" height={800}>
                <BarChart
                  data={maintenanceData.slice(
                    0,
                    Math.ceil(maintenanceData.length / 2)
                  )}
                  layout="vertical"
                  margin={{ top: 20, right: 2, left: 2, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis dataKey="region" type="category" width={150} />
                  <XAxis type="number" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Excellent" stackId="a" fill={colors[0]} />
                  <Bar dataKey="Good" stackId="a" fill={colors[1]} />
                  <Bar dataKey="Poor" stackId="a" fill={colors[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Second Column */}
            <div className="h-full w-full flex-grow">
              <ResponsiveContainer width="100%" height={800}>
                <BarChart
                  data={maintenanceData.slice(
                    Math.ceil(maintenanceData.length / 2)
                  )}
                  layout="vertical"
                  margin={{ top: 20, right: 2, left: 2, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis dataKey="region" type="category" width={150} />
                  <XAxis type="number" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Excellent" stackId="a" fill={colors[0]} />
                  <Bar dataKey="Good" stackId="a" fill={colors[1]} />
                  <Bar dataKey="Poor" stackId="a" fill={colors[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="h-full w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={maintenanceData}
                layout="vertical"
                margin={{ top: 20, right: 2, left: 2, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis dataKey="region" type="category" width={150} />
                <XAxis type="number" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Excellent" stackId="a" fill={colors[0]} />
                <Bar dataKey="Good" stackId="a" fill={colors[1]} />
                <Bar dataKey="Poor" stackId="a" fill={colors[2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceData;
