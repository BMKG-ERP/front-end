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

import { useSidebarContext } from '@/components/navigation/Sidebar';

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
  const { isMobile } = useSidebarContext();

  const renderCustomLabel = ({ x, y, width, height, value }) => {
    if (!value) return null; // Hide label if value is 0 or undefined

    return (
      <text
        x={x + width / 2} // Center horizontally
        y={y + height / 2} // Center vertically
        fill="white" // Adjust color based on your theme
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value} {/* ✅ Directly using the value from the dataKey */}
      </text>
    );
  };

  return (
    <div className="flex h-full w-full flex-col items-center">
      {/* ✅ Responsive Title */}
      <h2 className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
        Independent Maintenance
      </h2>

      {/* ✅ Scrollable Chart Container */}
      <div
        className={`grid gap-4 h-full w-full overflow-hidden ${
          isMobile ? 'grid-cols-1' : 'grid-cols-2'
        }`}
      >
        <div className="h-full w-full flex-grow overflow-y-auto">
          <ResponsiveContainer width="100%" height={800} minHeight={600}>
            <BarChart
              data={
                isMobile
                  ? maintenanceData
                  : maintenanceData.slice(
                      0,
                      Math.ceil(maintenanceData.length / 2)
                    )
              }
              layout="vertical"
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis
                dataKey="region"
                type="category"
                width={isMobile ? 100 : 150} // ✅ Dynamic width for better visibility
                tick={{ fontSize: isMobile ? 8 : 10 }}
                interval={0}
              />
              <XAxis type="number" tick={{ fontSize: isMobile ? 10 : 14 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '14px' }} />
              <Bar dataKey="Excellent" stackId="a" fill={colors[0]} />
              <Bar dataKey="Good" stackId="a" fill={colors[1]} />
              <Bar dataKey="Poor" stackId="a" fill={colors[2]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {!isMobile && (
          <div className="h-full w-full flex-grow overflow-y-auto">
            <ResponsiveContainer width="100%">
              <BarChart
                data={maintenanceData.slice(
                  Math.ceil(maintenanceData.length / 2)
                )}
                layout="vertical"
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                {/* ✅ Fixed Bar Height by Adjusting Y-Axis Height */}
                <YAxis
                  dataKey="region"
                  type="category"
                  width={150}
                  tick={{ fontSize: 10 }}
                  interval={0} // ✅ Ensures all labels are shown
                />

                <XAxis type="number" tick={{ fontSize: 14 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '14px' }} />

                {/* ✅ Bars Will Have Fixed Height */}
                <Bar
                  dataKey="Excellent"
                  stackId="a"
                  fill={colors[0]}
                  label={renderCustomLabel}
                />
                <Bar
                  dataKey="Good"
                  stackId="a"
                  fill={colors[1]}
                  label={renderCustomLabel}
                />
                <Bar
                  dataKey="Poor"
                  stackId="a"
                  fill={colors[2]}
                  label={renderCustomLabel}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceData;
