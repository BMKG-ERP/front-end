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
        `${
          process.env.NEXT_PUBLIC_LOCAL_API +
          process.env.NEXT_PUBLIC_STATION_API
        }/${decodedStationCode}/detail/`
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
            {data.station_code}
          </h1>

          {/* Responsive Three-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            <DetailItem label="Category" value={data.category} />
            <DetailItem label="Unit" value={data.unit} />
            <DetailItem label="Description" value={data.description} />
            <DetailItem label="Status" value={data.status} />
            <DetailItem label="Latitude" value={data.latitude} />
            <DetailItem label="Longitude" value={data.longitude} />
            <DetailItem label="Altitude" value={`${data.altitude}m`} />
            <DetailItem label="Province" value={data.province} />
            <DetailItem label="City" value={data.city} />
            <DetailItem label="District" value={data.district} />
            <DetailItem label="Subdistrict" value={data.subdistrict} />
            <DetailItem label="Network" value={data.network} />
            <DetailItem label="Start Date" value={data.start_date} />
            <DetailItem label="Address" value={data.address} />
            <DetailItem label="Use Flag" value={data.use_flag} />
          </div>

          {/* Show on Maps Button */}
          {data.maps && (
            <div className="mt-6 text-center">
              <a
                href={data.maps}
                target="_blank"
                className="text-blue-500 hover:underline flex items-center justify-center gap-2"
              >
                <FaMapMarkerAlt />
                Show on Maps
              </a>
            </div>
          )}
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default EquipmentDetail;
