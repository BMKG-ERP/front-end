'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRouter } from 'next/navigation';

const createCustomIcon = (color = 'gray') => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: ${color};
      border: 2px solid white;
      box-shadow: 0 0 2px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const getColorFromSearchScore = (score) => {
  if (score === null || score === undefined) return 'gray'; // Empty
  if (score < 35) return 'red';
  if (score < 80) return 'yellow';
  return 'green'; // 90%+
};

const IndonesiaMap = ({ interactive = false }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchLocations = useCallback(
    async (sort = '', order = '', page = 1, limit = -1, search = '') => {
      try {
        const url = new URL(
          `${process.env.NEXT_PUBLIC_LOCAL_API}/api/stations`
        );

        url.searchParams.append('page', page);
        url.searchParams.append('limit', limit);

        const response = await fetch(url.toString());
        const data = await response.json(); // Parse JSON response

        setLocations(data.data); // Ensure data is an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLocations('', '', 1, -1, '');
  }, []);

  // Memoized Pop-up Data
  const popUpData = useMemo(
    () =>
      locations.map((loc) => [
        ['Categoty', loc.category],
        ['City', loc.city],
        ['Province', loc.province],
        ['Status', loc.status, 'text-green-600'],
      ]),
    [locations]
  );

  // Show loading indicator
  if (loading) {
    return (
      <div className="bg-gray-400 w-full h-full flex justify-center items-center">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      bounds={[
        [-11, 94], // Bottom-left
        [6, 141], // Top-right
      ]}
      style={{
        height: '50vh',
        width: '100%',
        position: 'relative',
        zIndex: 10,
      }}
      zoomControl={false}
      dragging={interactive}
      scrollWheelZoom={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations.map((loc, index) => {
        const color = getColorFromSearchScore(loc.searchScore);

        return (
          <Marker
            key={index}
            position={[+loc.latitude, +loc.longitude]}
            icon={createCustomIcon(color)}
          >
            <Popup>
              <div className="p-2 w-72">
                <h1 className="font-bold text-lg">{loc.station_code}</h1>
                <a
                  href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {loc.latitude}, {loc.longitude}
                </a>

                {popUpData[index]?.map(([label, value, extraClass]) => (
                  <p key={label} className="w-full flex flex-row">
                    <span className="text-gray-500 w-full flex-1">
                      {label}:
                    </span>
                    <strong className={extraClass + ' w-full flex-1'}>
                      {value}
                    </strong>
                  </p>
                ))}

                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => {
                      router.push(`/stations/${loc.station_code}`);
                    }}
                    className="w-full bg-blue-100 text-blue-600 py-1 rounded-md hover:bg-blue-200"
                  >
                    View Details
                  </button>
                  <a
                    href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-gray-100 text-gray-600 py-1 rounded-md hover:bg-gray-200"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default IndonesiaMap;
