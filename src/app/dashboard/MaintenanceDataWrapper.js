'use client';

import dynamic from 'next/dynamic';

// Disable SSR for Leaflet
const MaintenanceData = dynamic(() => import('./MaintenanceData'), {
  ssr: false,
});

export default MaintenanceData;
