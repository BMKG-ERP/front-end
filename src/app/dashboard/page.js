'use client';

import MaintenanceData from './MaintenanceData';
import EvaluationData from './EvaluationStatus';
import IndonesiaMap from './IndonesianMapWrapper';
import Header from '@/components/navigation/Header';

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-teal-400 min-w-screen md:border-x mt-[5vh] flex flex-col items-center py-4 md:px-4 px-auto mx-auto lg:px-12 xl:px-10">
        <h1 className="text-2xl font-bold">This is Main Page</h1>
        <div className="bg-red-600 w-full font-bold mx-auto font-sans flex flex-col md:flex-row p-4 my-[0vh] md:my-[7vh]">
          <div className="flex flex-col items-center justify-center w-full">
            <IndonesiaMap interactive={false} />
          </div>
        </div>
        <div className=" font-bold font-sans flex flex-row w-full">
          {/* <div className="bg-blue-600 font-bold font-sans flex flex-col md:flex-row p-4 my-[0vh] md:my-[7vh]"> */}
          <div className="flex flex-1 border-4 border-yellow-500 justify-center items-center">
            <EvaluationData />
          </div>
          <div className="flex flex-2 border-4 border-blue-500 justify-center items-center">
            <MaintenanceData />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
