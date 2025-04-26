'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Table from '@/components/table/Table';
import DetailEquipment from './DetailEquipment';

const EquipmentTable = ({ stationCode }) => {
  const decodedStationCode = stationCode
    ? decodeURIComponent(stationCode).toUpperCase()
    : '';
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const handleViewDetail = (equipmentData) => {
    setSelectedEquipment(equipmentData);
  };

  const handleCloseDetail = () => {
    setSelectedEquipment(null);
  };

  const dataTable = true;

  const router = useRouter();

  const fetchData = useCallback(
    async (sort = '', order = '', page = 1, limit = -1, search = '') => {
      setLoading(true);
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_LOCAL_API}${process.env.NEXT_PUBLIC_STATION_API}${decodedStationCode}${process.env.NEXT_PUBLIC_STATION_EQUIPMENT_API}`
        );

        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);

        const response = await fetch(url.toString());
        const result = await response.json();

        if (!result.error && result.code === 200) {
          return {
            data: result.data || [],
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
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCategories = useCallback(async () => {
    try {
      const url = new URL(
        `${
          process.env.NEXT_PUBLIC_LOCAL_API +
          process.env.NEXT_PUBLIC_EQUIPMENT_CATEGORIES_API
        }`
      );

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.error) {
        const categoryNames = result.data.map((item) => item.category);
        setCategories(categoryNames); // Only set the names
      } else {
        console.error('Error fetching categories:', result.message);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData('', '', 1, -1, '');
    fetchCategories();
  }, []); // Added dependencies

  const columns = [
    {
      accessorKey: 'equipment_id',
      header: () => (
        <div className="flex items-center justify-center gap-1 cursor-pointer">
          Equipment ID
        </div>
      ),
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
      accessorKey: 'manufacture',
      header: 'Manufacture',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },

    {
      accessorKey: 'installation_date',
      header: 'Instalation Date',
    },

    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4 items-center justify-center">
          <div className="relative group">
            <FaEye
              className="text-xl text-cyan-700 hover:text-cyan-900 cursor-pointer"
              onClick={() => handleViewDetail(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </span>
          </div>

          {/* <div className="relative group">
            <FaEdit
              className="text-xl text-emerald-700 hover:text-emerald-900 cursor-pointer"
              onClick={() => openEditEquipment(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>

          <div className="relative group">
            <FaTrash
              className="text-xl text-rose-700 hover:text-rose-900 cursor-pointer"
              onClick={() => openDeleteEquipment(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Delete
            </span>
          </div> */}
        </div>
      ),
    },
  ];

  const colStyling = {
    equipment_id: 'font-bold text-blue-950', // Bold & blue
    status: 'font-bold text-blue-950', // Bold & blue
  };

  return (
    <div className="w-full max-w-full p-4">
      <div className="relative w-full h-full">
        <Table
          columns={columns}
          dataTable={dataTable}
          fetchData={fetchData}
          colStyling={colStyling}
          // createButton={true}
          // createFunction={openCreateEquipment}
          createName={'Create Equipment'}
          fontSize="12"
          categories={categories}
          searchPlaceholder={'Search Equipments'}
        />
      </div>
      {selectedEquipment && (
        <DetailEquipment
          formData={selectedEquipment}
          closeEditEquipment={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default EquipmentTable;
