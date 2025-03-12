'use client';

import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Papa from 'papaparse';

// Fix default icon issue in Leaflet (Next.js)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Default marker icon
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const IndonesiaMap = ({ interactive = false }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Load CSV file dynamically
    fetch('/stations.csv')
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setLocations(result.data);
          },
        });
      });
  }, []);

  return (
    <MapContainer
      bounds={[
        [-11, 94], // Bottom-left (Southwest of Indonesia)
        [6, 141], // Top-right (Northeast of Indonesia)
      ]}
      style={{ height: '40vh', width: '60vw' }}
      zoomControl={false}
      dragging={interactive}
      scrollWheelZoom={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Add Markers from CSV */}
      {locations.map((loc) => (
        <div key={loc.id}>
          <CircleMarker
            center={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
            radius={5}
            color="red"
            fillColor="red"
            fillOpacity={1}
          />
          <Marker
            position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
            icon={defaultIcon}
          >
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              📍 {loc.region}
              <br />
              🏠 {loc.address}
              <br />
              <a href={loc.link} target="_blank" rel="noopener noreferrer">
                View on Google Maps
              </a>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
};

export default IndonesiaMap;
