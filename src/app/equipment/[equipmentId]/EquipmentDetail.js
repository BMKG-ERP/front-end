'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const EquipmentDetail = ({ equipmentId }) => {
  const decodedEquipmentId = equipmentId
    ? decodeURIComponent(equipmentId).toUpperCase()
    : '';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (decodedEquipmentId) {
      fetchData();
    }
  }, [decodedEquipmentId]); // Only triggers when stationCode changes

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL(
        `http://127.0.0.1:8000/api/crud/equipments/${decodedEquipmentId}`
      );

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.error && result.code === 200) {
        setData(result.data); // Directly store station data
      } else {
        console.error('Error fetching station:', result.message);
      }
    } catch (error) {
      console.error('Error fetching station:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reusable Component for Displaying Data
  const DetailItem = ({ label, value }) => (
    <p className="text-gray-700 w-full border-b border-gray-200 pb-2">
      <strong className="text-gray-900">{label}:</strong> {value || 'N/A'}
    </p>
  );

  return (
    <div className="w-full p-4">
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            {data.equipment_id}
          </h1>

          {/* Responsive Three-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <DetailItem label="Name" value={data.name} />
            <DetailItem label="Category" value={data.category} />
            <DetailItem label="Equipment ID" value={data.equipment_id} />
            <DetailItem label="Station Code" value={data.station_code} />
            <DetailItem label="Status" value={data.status} />
            <DetailItem label="Use Flag" value={data.use_flag} />
            <DetailItem label="Description" value={data.description} />
            <DetailItem
              label="Calibration Date"
              value={data.calibration_date}
            />
            <DetailItem
              label="Installation Date"
              value={data.installation_date}
            />
            <DetailItem label="Serial Number" value={data.serial_number} />
            <DetailItem
              label="Firmware Version"
              value={data.firmware_version}
            />
            <DetailItem label="Input" value={data.input} />
            <DetailItem label="Sampling Rate" value={data.sampling_rate} />
            <DetailItem label="Type" value={data.type} />
            <DetailItem label="Manufacture" value={data.manufacture} />
            <DetailItem label="Technician" value={data.technician} />
            <DetailItem label="Supplier" value={data.supplier} />
          </div>

          {/* Show on Maps Button */}
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default EquipmentDetail;
