'use client';

import IndonesiaMap from './IndonesianMapWrapper';
import EquipmentCategory from './EquipmentCategory';
import SummaryDisplay from './EquipmentName';

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
            <div className="basis-1/4  rounded-xl shadow-2xl flex justify-center items-center p-4 sm:w-full md:w-full lg:w-auto">
              <EquipmentCategory />
            </div>
            <div className="basis-3/4 rounded-xl shadow-2xl flex justify-center items-center p-4 sm:w-full md:w-full lg:w-auto">
              <SummaryDisplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
