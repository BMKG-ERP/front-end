'use client';

import dynamic from 'next/dynamic';

// Disable SSR for Leaflet
const IndonesiaMap = dynamic(() => import('./indonesiaMap'), { ssr: false });

export default IndonesiaMap;
