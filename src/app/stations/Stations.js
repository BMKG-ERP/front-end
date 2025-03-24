'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
} from 'react-icons/fa';

const SortIcon = ({ column }) => {
  return column.getIsSorted() === 'asc' ? (
    <FaSortUp />
  ) : column.getIsSorted() === 'desc' ? (
    <FaSortDown />
  ) : (
    <FaSort />
  );
};

const StationTable = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
  });
  const [isCreateStation, setIsCreateStation] = useState(false);
  const [isEditStation, setIsEditStation] = useState(false);
  const [isDeleteStation, setIsDeleteStation] = useState(false);
  const [formData, setFormData] = useState({
    station_code: '',
    category: '',
    unit: '',
    description: '',
    status: '',
    maps: '',
    latitude: '',
    longitude: '',
    altitude: '',
    province: '',
    city: '',
    district: '',
    subdistrict: '',
    network: '',
    start_date: '',
    address: '',
    use_flag: '',
  });

  const router = useRouter();

  const fetchData = async (
    sort = '',
    order = '',
    page = 1,
    limit = 10,
    search = ''
  ) => {
    setLoading(true);
    try {
      const url = new URL('http://127.0.0.1:8000/api/stations');
      if (sort && order) {
        url.searchParams.append('sort', sort);
        url.searchParams.append('order', order);
      }
      url.searchParams.append('page', page);
      url.searchParams.append('limit', limit);
      if (search) {
        url.searchParams.append('search', search);
      }

      const response = await fetch(url.toString());
      const result = await response.json();
      console.log('Fetched Data:', result.data.length); // Debugging log

      if (!result.error && result.code === 200) {
        setData(result.data || []);
        setPagination((prev) => ({
          ...prev,
          page,
          totalPages: result.pagination.totalPages,
          limit,
        }));
      } else {
        console.error('Error fetching stations:', result.message);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createStation = async () => {
    try {
      const url = new URL('http://127.0.0.1:8000/api/crud/stations/');
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Success:', result);
      closeCreateStation(); // Close modal after saving
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateStation = async () => {
    try {
      const url = new URL('http://127.0.0.1:8000/api/crud/stations/');
      const response = await fetch(
        `${url.toString()}${formData.station_code}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log('Updated:', result);
      closeEditStation(); // Close modal after update
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteStation = async () => {
    try {
      const url = new URL('http://127.0.0.1:8000/api/crud/stations/');
      const response = await fetch(
        `${url.toString()}${formData.station_code}/`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      console.log('Deleted:', result);
      closeEditStation(); // Close modal after update
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData('', '', pagination.page, pagination.limit, searchQuery);
  }, [pagination.page, pagination.limit, searchQuery]); // Added dependencies

  const handleSort = (column) => {
    const currentSorting = sorting.find((s) => s.id === column.id);
    const newOrder = currentSorting?.desc ? 'asc' : 'desc';
    setSorting([{ id: column.id, desc: newOrder === 'desc' }]);
    fetchData(
      column.id,
      newOrder,
      pagination.page,
      pagination.limit,
      searchQuery
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchData('', '', newPage, pagination.limit, searchQuery);
    }
  };

  const handleLimitChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    fetchData('', '', 1, newLimit, searchQuery);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    fetchData('', '', 1, pagination.limit, event.target.value);
  };

  const openCreateStation = () => setIsCreateStation(true);
  const closeCreateStation = () => setIsCreateStation(false);
  const openEditStation = (data) => {
    setFormData(data); // Populate form fields
    setIsEditStation(true);
  };

  const closeEditStation = () => setIsEditStation(false);
  const openDeleteStation = () => setIsDeleteStation(true);
  const closeDeleteStation = () => setIsDeleteStation(false);

  const columns = [
    {
      accessorKey: 'station_code',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Station Code
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Category
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'city',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          City
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'province',
      header: ({ column }) => (
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => handleSort(column)}
        >
          Province
          <SortIcon column={column} />
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <button
          className="text-cyan-700 hover:text-cyan-900 cursor-pointer flex items-center justify-center"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open(
                `https://www.google.com/maps?q=${row.original.latitude},${row.original.longitude}`,
                '_blank'
              );
            }
          }}
        >
          <FaMapMarkerAlt /> Show on Maps
        </button>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-4 items-center justify-center">
          <div className="relative group">
            <FaEye
              className="text-xl text-cyan-700 hover:text-cyan-900 cursor-pointer"
              onClick={() =>
                router.push(`/stations/${row.original.station_code}`)
              }
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              View
            </span>
          </div>

          <div className="relative group">
            <FaEdit
              className="text-xl text-emerald-700 hover:text-emerald-900 cursor-pointer"
              onClick={() => openEditStation(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>

          <div className="relative group">
            <FaTrash
              className="text-xl text-rose-700 hover:text-rose-900 cursor-pointer"
              onClick={() => openDeleteStation(row.original)}
            />
            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Delete
            </span>
          </div>
        </div>
      ),
    },
  ];

  const colStyling = {
    station_code: 'font-bold text-blue-950', // Bold & blue
    category: 'text-gray-700', // Green text
    city: 'text-gray-700', // Semi-bold
    province: 'text-gray-700', // Italic & purple
    description: 'text-gray-700', // Gray text
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <div className="w-full max-w-full p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search stations..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          <FaSearch className="absolute right-2 top-2 text-gray-400" />
        </div>
        <div>
          <button
            className="bg-teal-800 rounded-xl p-3 text-white hover:bg-teal-600 "
            onClick={openCreateStation}
          >
            CREATE STATION
          </button>
        </div>
      </div>
      <div className="relative w-full h-full">
        <table className="w-full border border-cyan-700 rounded-lg shadow-md">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="text-cyan-900 font-bold">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-y p-3 py-5 text-center" // Center text alignment
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white border-cyan-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-20">
                  Loading...
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  //   className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}
                >
                  {row.getVisibleCells().map((cell) => {
                    // Get the column ID and corresponding style
                    const columnId = cell.column.id;
                    const cellStyle = colStyling[columnId] || ''; // Default to no extra style if not specified

                    return (
                      <td
                        key={cell.id}
                        className={`border-y p-4 px-5 border-cyan-700 ${cellStyle}`} // Apply specific styles
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-4">
        <div>
          Show{' '}
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="border p-2"
          >
            {' '}
            <option value={5}>5</option> <option value={10}>10</option>{' '}
            <option value={20}>20</option> <option value={50}>50</option>{' '}
          </select>{' '}
          entries
        </div>
      </div>
      {/* Modal */}
      {isCreateStation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Station</h2>
              <FaTimes
                className="cursor-pointer"
                onClick={closeCreateStation}
              />
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createStation();
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Station Code', 'station_code'],
                  ['Category', 'category'],
                  ['Unit', 'unit'],
                  ['Description', 'description'],
                  ['Status', 'status'],
                  ['Maps URL', 'maps'],
                  ['Latitude', 'latitude'],
                  ['Longitude', 'longitude'],
                  ['Altitude', 'altitude'],
                  ['Province', 'province'],
                  ['City', 'city'],
                  ['District', 'district'],
                  ['Subdistrict', 'subdistrict'],
                  ['Network', 'network'],
                  ['Start Date', 'start_date'],
                  ['Address', 'address'],
                  ['Use Flag', 'use_flag'],
                ].map(([label, name], index) => (
                  <div key={index} className="mb-3">
                    <label className="block text-sm font-medium">{label}</label>
                    <input
                      type={name === 'start_date' ? 'date' : 'text'}
                      name={name}
                      value={formData[name]}
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={(e) =>
                        setFormData({ ...formData, [name]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditStation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Station</h2>
              <FaTimes className="cursor-pointer" onClick={closeEditStation} />
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStation();
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Station Code', 'station_code'],
                  ['Category', 'category'],
                  ['Unit', 'unit'],
                  ['Description', 'description'],
                  ['Status', 'status'],
                  ['Maps URL', 'maps'],
                  ['Latitude', 'latitude'],
                  ['Longitude', 'longitude'],
                  ['Altitude', 'altitude'],
                  ['Province', 'province'],
                  ['City', 'city'],
                  ['District', 'district'],
                  ['Subdistrict', 'subdistrict'],
                  ['Network', 'network'],
                  ['Start Date', 'start_date'],
                  ['Address', 'address'],
                  ['Use Flag', 'use_flag'],
                ].map(([label, name], index) => (
                  <div key={index} className="mb-3">
                    <label className="block text-sm font-medium">{label}</label>
                    <input
                      type={name === 'start_date' ? 'date' : 'text'}
                      name={name}
                      value={formData[name] || ''}
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={(e) =>
                        setFormData({ ...formData, [name]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteStation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delete Station</h2>
              <FaTimes
                className="cursor-pointer"
                onClick={closeCreateStation}
              />
            </div>
            <div className="flex items-center p-4 justify-center">
              <h1>Are you sure want to delete this station?</h1>
            </div>
            <div className="flex items-center p-4 justify-center">
              <button
                className="px-4 py-3 rounded-2xl border-2 border-teal-700 mx-5 hover:bg-teal-300"
                onClick={closeDeleteStation}
              >
                Cancel
              </button>
              <button
                className="px-4 text-white py-3 mx-5 bg-red-600 rounded-2xl hover:bg-red-400"
                onClick={deleteStation}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationTable;
