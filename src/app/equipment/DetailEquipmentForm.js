'use client';

import { FaTimes } from 'react-icons/fa';

const DetailEquipmentView = ({ formData, closeViewEquipment }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[40vw] h-[70vh] overflow-visible overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
        {/* Header */}
        <div className="sticky top-0 z-20 p-6 bg-white flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-bold">Equipment Details</h2>
          <FaTimes className="cursor-pointer" onClick={closeViewEquipment} />
        </div>

        {/* Details Display */}
        <div className="grid grid-cols-2 gap-4 p-6">
          {[
            ['Equipment ID', 'equipment_id'],
            ['Name', 'name'],
            ['Serial Number', 'serial_number'],
            ['Station Code', 'station_code'],
            ['Category', 'category'],
            ['Description', 'description'],
            ['Firmware Version', 'firmware_version'],
            ['Input', 'input'],
            ['Installation Date', 'installation_date'],
            ['Manufacture', 'manufacture'],
            ['Sampling Rate', 'sampling_rate'],
            ['Type', 'type'],
            ['Status', 'status'],
            ['Supplier', 'supplier'],
            ['Technician', 'technician'],
            ['Calibration Date', 'calibration_date'],
            ['Use Flag', 'use_flag'],
          ].map(([label, name], index) => (
            <div key={index} className="mb-3">
              <label className="block text-sm font-medium text-gray-600">
                {label}
              </label>
              <p className="text-gray-900 font-medium p-2 border border-gray-200 rounded bg-gray-50">
                {formData[name] || '-'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailEquipmentView;
