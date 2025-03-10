'use client';

import Image from 'next/image';
import MaintenanceData from './maintenanceData';
import EvaluationData from './evaluationStatus';
import IndonesiaMap from './indonesianMapWrapper';

export default function Home() {
  return (
    <div className="relative min-h-screen flex text-white flex-col md:h-screen md:w-screen items-center justify-center bg-[#191e317d]">
      <main className="flex flex-col items-center justify-center min-h-screen w-full">
        <h1 className="text-2xl font-bold">This is Main Page</h1>
        <div className="h-20vh flex items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full">
            <IndonesiaMap interactive={true} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 w-full px-20 bg-gray-300">
          <div className="flex flex-1 justify-center items-center">
            <EvaluationData />
          </div>
          <div className="flex flex-2 justify-center items-center">
            <MaintenanceData />
          </div>
        </div>
      </main>
    </div>
  );
}
