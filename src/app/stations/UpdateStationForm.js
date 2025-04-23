'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const UpdateStationForm = ({
  formData,
  setFormData,
  closeEditStation,
  showNotification,
  validateForm,
  handleChange,
  errors,
  setErrors,
  isFormValid,
  setIsLoading,
  isLoading,
}) => {
  const updateStation = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const url = new URL(
          `${
            process.env.NEXT_PUBLIC_LOCAL_API +
            process.env.NEXT_PUBLIC_STATION_API
          }`
        );
        // const url = new URL('http://127.0.0.1:2000/api/crud/stations/');
        const response = await fetch(
          `${url.toString()}${formData.station_code}/`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }
        );

        const result = await response.json();
        setIsLoading(false);
        if (!result.error && result.code === 200) {
          // setIsEditStation(false);
          showNotification(
            result.code,
            `Succes update Station ${formData.station_code} `,
            result.message
          );

          setFormData([]);
          // setIsEditStation(false);
        } else {
          showNotification(
            result.code,
            `Error update new Station ${formData.station_code} `,
            result.message
          );
        }
        // closeEditStation(); // Close modal after update
      } catch (error) {
        setIsLoading(false);
        showNotification(500, `Server error`, 'Internal Server Error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[40vw] h-[70vh]  overflow-visible overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
        {/* Header */}
        <div className="sticky top-0 z-20 p-6 bg-white flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-bold">Edit Station</h2>
          <FaTimes className="cursor-pointer" onClick={closeEditStation} />
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              updateStation();
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4 p-6">
            {[
              ['Station Code', 'station_code'],
              ['Category', 'category'],
              ['Unit', 'unit'],
              ['Description', 'description'],
              ['Status', 'status'],
              ['Maps URL', 'maps'],
              ['Latitude', 'latitude'],
              ['Longitude', 'longitude'],
              ['Altitude', 'altitude'],
              ['Province', 'province'],
              ['City', 'city'],
              ['District', 'district'],
              ['Subdistrict', 'subdistrict'],
              ['Network', 'network'],
              ['Start Date', 'start_date'],
              ['Address', 'address'],
              ['Use Flag', 'use_flag'],
            ].map(([label, name], index) => (
              <div key={index} className="mb-3">
                <label className="block text-sm font-medium">
                  {label}{' '}
                  {[
                    'station_code',
                    'category',
                    'unit',
                    'status',
                    'province',
                    'city',
                    'address',
                    'latitude',
                    'longitude',
                    'start_date',
                  ].includes(name) && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={name === 'start_date' ? 'date' : 'text'}
                  name={name}
                  value={formData[name] || ''}
                  className={`w-full p-2 border ${
                    errors[name] ? 'border-red-500' : 'border-gray-300'
                  } rounded`}
                  onChange={handleChange} // ✅ Live validation fix
                />

                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="sticky bottom-0 z-20 p-6 bg-white border-gray-200 border-t-2">
            <button
              type="submit"
              className={
                'w-full py-2 rounded mt-4 transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer          '
              }
            >
              Save
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

export default UpdateStationForm;
