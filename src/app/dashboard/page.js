'use client';

import MaintenanceData from './MaintenanceDataWrapper';
import EvaluationData from './EvaluationStatus';
import IndonesiaMap from './IndonesianMapWrapper';

function LandingPage() {
  return (
    <div className="z-10 min-h-screen w-full flex justify-center">
      <div className="w-full h-full max-w-[1800px] mt-10 border-x-2 border-gray-300 bg-white flex flex-col items-center py-4 px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl font-bold">This is Main Page</h1>

        <div className="w-full h-full mx-auto mb-10 mt-5">
          <div className="flex flex-col items-center mb-5 justify-center z-20 w-full h-[300px] md:h-[500px]">
            <IndonesiaMap interactive={true} />
          </div>

          <div className="font-bold font-sans w-full flex flex-col md:flex-col lg:flex-row gap-4">
            <div className="md:flex-1 border-4 border-yellow-500 justify-center items-center p-4 sm:w-full md:w-full lg:w-1/2">
              <EvaluationData />
            </div>
            <div className="md:flex-3 border-4 border-blue-500 justify-center items-center p-4 sm:w-full md:w-full lg:w-1/2">
              <MaintenanceData />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
