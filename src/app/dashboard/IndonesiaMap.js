'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';

const createCustomIcon = (color = 'red') => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="font-size: 24px; color: ${color};"><i class="icon-marker">📍</i></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const IndonesiaMap = ({ interactive = false }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch CSV Data
  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_API}/api/stations`
      );
      const data = await response.json(); // Parse JSON response

      console.log('API Response:', data); // Debugging

      setLocations(data.data); // Ensure data is an array
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

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

      {locations.map((loc, index) => (
        <Marker
          key={index}
          position={[+loc.latitude, +loc.longitude]}
          icon={createCustomIcon('blue')}
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
                  <span className="text-gray-500 w-full flex-1">{label}:</span>
                  <strong className={extraClass + ' w-full flex-1'}>
                    {value}
                  </strong>
                </p>
              ))}

              <div className="mt-3 space-y-2">
                <button className="w-full bg-blue-100 text-blue-600 py-1 rounded-md hover:bg-blue-200">
                  View Details Report
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
      ))}
    </MapContainer>
  );
};

export default IndonesiaMap;
