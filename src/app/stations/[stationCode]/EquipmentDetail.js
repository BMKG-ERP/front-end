'use client';

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const EquipmentDetail = ({ stationCode }) => {
  const decodedStationCode = stationCode
    ? decodeURIComponent(stationCode).toUpperCase()
    : '';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (decodedStationCode) {
      fetchData();
    }
  }, [decodedStationCode]); // Only triggers when stationCode changes

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = new URL(
        `http://127.0.0.1:8000/api/stations-detail/${decodedStationCode}/detail/`
      );

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.error && result.code === 200) {
        setData(result.data.station); // Directly store station data
      } else {
        console.error('Error fetching station:', result.message);
      }
    } catch (error) {
      console.error('Error fetching station:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full p-4">
      {loading ? (
        <p>Loading...</p>
      ) : data ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {data.station_code}
          </h1>
          <p className="text-lg text-gray-600">{data.category}</p>
          <p className="text-gray-700">{data.address}</p>
          <p className="text-gray-700">
            {data.city}, {data.province}
          </p>
          <p className="text-gray-700">Altitude: {data.altitude}m</p>
          <a
            href={data.maps}
            target="_blank"
            className="text-blue-500 hover:underline flex items-center gap-1 mt-2"
          >
            <FaMapMarkerAlt /> Show on Maps
          </a>
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default EquipmentDetail;
