'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const CreateEquipmentForm = ({
  formData,
  setFormData,
  closeCreateEquipment,
  showNotification,
  validateForm,
  handleChange,
  errors,
  setErrors,
  isFormValid,
  setIsLoading,
  isLoading,
}) => {
  const createEquipment = async () => {
    setIsLoading(true);
    try {
      const url = new URL('http://127.0.0.1:8000/api/crud/equipments/');
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setIsLoading(false);
      if (!result.error && result.code === 200) {
        showNotification(
          result.code,
          `Success create new equipment with code ${formData.equipment_code}`,
          result.message
        );
      } else {
        showNotification(
          result.code,
          result.message,
          `Failed create new equipment with code ${formData.equipment_code}`
        );
      }
    } catch (error) {
      console.error('Error creating equipment:', error);
      setIsLoading(false);
      showNotification(500, `Server error`, 'Internal Server Error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[40vw] h-[70vh]  overflow-visible overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
        {/* Header */}
        <div className="sticky top-0 z-20 p-6 bg-white flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-bold">Create equipment</h2>
          <FaTimes className="cursor-pointer" onClick={closeCreateEquipment} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              createEquipment();
            }
          }}
        >
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
                <label className="block text-sm font-medium">
                  {label}{' '}
                  {[
                    'equipment_id',
                    'name',
                    'serial_number',
                    'description',
                  ].includes(name) && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={name === 'calibration_date' ? 'date' : 'text'}
                  name={name}
                  value={formData[name]}
                  className={`w-full p-2 border ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                  } rounded`}
                  onChange={handleChange}
                />
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 z-20 p-6 bg-white border-gray-200 border-t-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            {!isFormValid && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Please fill the mandatory fields
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEquipmentForm;
