'use client';

import EquipmentTable from './EquipmentTable';

// import EquipmenTable from './';

function EquipmentPage() {
  return (
    <div className="z-10 h-full w-full flex justify-center">
      <div className="w-full h-full max-w-[1800px] mt-10 border-x-2 border-gray-300 bg-white flex flex-col items-center py-4 px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl font-bold">This is Equipment Page</h1>

        <div className="w-full h-full mx-auto mb-10 mt-5">
          <div className="flex flex-col items-center mb-5 justify-center z-20 w-full h-[300px] md:h-full">
            <EquipmentTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentPage;
