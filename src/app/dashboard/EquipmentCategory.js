import Table from '@/components/table/Table';
import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF4560',
  '#26E7A6',
];

const EquipmentCategory = () => {
  const [chartSize, setChartSize] = useState();
  const [evaluationData, setEvaluationData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRows: 0,
    limit: -1,
  });

  const fetchEvaluationData = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_LOCAL_API +
          process.env.NEXT_PUBLIC_EQUIPMENT_SUMMARY_CATEGORY_API
        }`
      );
      const result = await response.json();

      if (result.data) {
        // Add color field manually
        const coloredData = result.data
          .map((item, index) => ({
            ...item,
            color: COLORS[index % COLORS.length], // cycle colors if data > COLORS.length
          }))
          .sort((a, b) => b.item_count - a.item_count); // ✅ sort by item_count descending

        setEvaluationData(coloredData);
      } else {
        setEvaluationData([]);
      }

      // setEvaluationData(data.data || []); // Ensure data is an array
      // setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // setLoading(false);
    }
  };

  const fetchEquipmentData = useCallback(
    async (sort = '', order = '', page = 1, limit = -1, search = '') => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_LOCAL_API +
            process.env.NEXT_PUBLIC_EQUIPMENT_NAME_API
          }`
        );
        const result = await response.json();

        if (!result.error) {
          const sortedData = (result.data || []).sort((a, b) => {
            if (a.use_flag === 'Y' && b.use_flag !== 'Y') return -1;
            if (a.use_flag !== 'Y' && b.use_flag === 'Y') return 1;
            return 0; // keep the order if both are same
          });

          return {
            data: sortedData,
            pagination: result.pagination,
          };
        } else {
          console.error('Error fetching stations:', result.message);
          return {
            data: [],
            pagination: {
              total: 0,
              totalRows: 0,
              totalPages: 1,
            },
          };
        }

        // if (result.data) {
        //   // Add color field manually
        //   // const sortedData = result.data.sort((a, b) => {
        //   //   if (a.check_flag === 'Y' && b.check_flag !== 'Y') return -1;
        //   //   if (a.check_flag !== 'Y' && b.check_flag === 'Y') return 1;
        //   //   // If both have the same check_flag, sort by item_count descending
        //   //   return b.item_count - a.item_count;
        //   // });

        //   // setEquipmentData(sortedData);
        // } else {
        //   // setEquipmentData([]);
        // }

        // setEvaluationData(data.data || []); // Ensure data is an array
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching stations:', error);
        return {
          data: [],
          pagination: {
            total: 0,
            totalRows: 0,
            totalPages: 1,
          },
        };
        // setLoading(false);
      }
    },
    []
  );

  const columns = [
    {
      id: 'no',
      header: 'No',
      cell: ({ row }) => {
        return (pagination.page - 1) * pagination.limit + row.index + 1;
      },
    },
    {
      accessorKey: 'name',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Name
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Category
        </div>
      ),
    },
    {
      accessorKey: 'check_flag',
      header: 'Health',
      cell: ({ getValue }) => {
        const value = getValue();
        if (value === 'Y') return 'Checked';
        if (value === 'N') return 'Not Checked';
        return value || '-';
      },
    },
  ];

  useEffect(() => {
    // ✅ Handle window resize
    const handleResize = () => {
      setChartSize(window.innerWidth < 768 ? 300 : 400);
    };

    handleResize(); // Set initial chart size
    fetchEvaluationData(); // Fetch data when component mounts & when `page` changes

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // ✅

  const colStyling = {
    no: 'font-bold text-blue-950 h-[10px]', // Bold & blue
    name: 'font-bold text-blue-950', // Bold & blue
    category: 'font-bold text-blue-950', // Bold & blue
    check_flag: 'font-bold text-blue-950', // Bold & blue
  };

  return (
    <div className="flex flex-col items-center h-full">
      <h2 className="text-xl my-4 font-bold">Equipment Category</h2>

      {/* Pie Chart */}
      <div className="flex items-center justify-center">
        <PieChart width={chartSize} height={chartSize}>
          <Pie
            data={evaluationData}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="90%"
            dataKey="item_count"
            nameKey="item"
            label={({ percent, x, y }) => (
              <text
                x={x}
                y={y}
                fill="black"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12} // you can make it bigger if you want
                fontWeight="bold"
              >
                {(percent * 100).toFixed(1)}%
              </text>
            )}
            labelLine={false} // no lines between slices
          >
            {evaluationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} items`} />
          <Legend
            wrapperStyle={{ fontSize: 12, marginTop: 50 }}
            // Adjust font size here (text-sm equivalent)
          />
        </PieChart>
      </div>

      <div>
        <Table
          columns={columns}
          dataTable={true}
          fetchData={fetchEquipmentData}
          colStyling={colStyling}
          fontSize="10"
          miniSize={true}
        />
      </div>

      {/* Legend Section */}
      {/* <div className="w-full max-w-sm mt-5 mx-auto">
        {evaluationData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-blue-200"
          >
            <div className="flex items-center gap-2">
              <span style={{ color: item.color }} className="text-xl">
                {item.icon}
              </span>
              <span className="font-semibold text-lg">{item.item}</span>
            </div>
            <span className="text-gray-900 font-bold text-xl">
              {item.item_count}
            </span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default EquipmentCategory;
