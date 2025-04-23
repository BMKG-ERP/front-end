'use client';

import SelectDropdown from '@/components/table/SelectDropdown';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const CreateStationForm = ({
  formData,
  setFormData,
  closeCreateStation,
  showNotification,
  validateForm,
  handleChange,
  errors,
  setErrors,
  isFormValid,
  setIsLoading,
  isLoading,
}) => {
  const createStation = async () => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...formData,
        latitude: parseFloat(formData.latitude), // Ensure it's a number
        longitude: parseFloat(formData.longitude), // Ensure it's a number
        altitude: parseFloat(formData.altitude), // Ensure it's a number
      };
      const url = new URL(
        `${
          process.env.NEXT_PUBLIC_LOCAL_API +
          process.env.NEXT_PUBLIC_STATION_API
        }`
      );
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      setIsLoading(false);
      if (!result.error && result.code === 200) {
        showNotification(
          result.code,
          `Success create new Station with code ${formData.station_code}`,
          result.message
        );
      } else {
        showNotification(
          result.code,
          result.message,
          `Failed create new Station with code ${formData.station_code}`
        );
      }
    } catch (error) {
      console.error('Error creating station:', error);
      setIsLoading(false);
      showNotification(500, `Server error`, 'Internal Server Error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[40vw] h-[70vh]  overflow-visible overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
        {/* Header */}
        <div className="sticky top-0 z-20 p-6 bg-white flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-bold">Create Station</h2>
          <FaTimes className="cursor-pointer" onClick={closeCreateStation} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validateForm()) {
              createStation();
            }
          }}
        >
          <div className="grid grid-cols-2 gap-4 p-6">
            {[
              ['Station Code', 'station_code'],
              ['Category', 'category', 'categories'],
              ['Unit', 'unit'],
              ['Description', 'description'],
              ['Status', 'status'],
              ['Maps URL', 'maps'],
              ['Latitude', 'latitude'], // Latitude field will now be a number input
              ['Longitude', 'longitude'], // Longitude field will now be a number input
              ['Altitude', 'altitude'], // Altitude field will now be a number input
              ['Province', 'province'],
              ['City', 'city'],
              ['District', 'district'],
              ['Subdistrict', 'subdistrict'],
              ['Network', 'network'],
              ['Start Date', 'start_date'],
              ['Address', 'address'],
            ].map(([label, name, apiName], index) => (
              <div key={index} className="mb-3">
                <label className="block text-sm font-medium">{label}</label>

                {/* Handle dropdown for specific fields like category, unit, etc. */}
                {apiName ? ( // Check if there's an API for this field
                  <SelectDropdown
                    url={`${process.env.NEXT_PUBLIC_LOCAL_API}/api/${apiName}/`} // Dynamically set API URL
                    data={formData[name] ? [formData[name]] : []}
                    setData={(selected) =>
                      setFormData({ ...formData, [name]: selected[0] || '' })
                    }
                    optionKey={name} // Field to display in dropdown
                    valueKey={name} // Field to store in formData
                  />
                ) : name === 'start_date' ? (
                  <input
                    type="date"
                    name={name}
                    value={formData[name]}
                    className={`w-full p-2 border ${
                      errors[name] ? 'border-red-500' : 'border-gray-300'
                    } rounded`}
                    onChange={handleChange}
                  />
                ) : name === 'latitude' ||
                  name === 'longitude' ||
                  name === 'altitude' ? ( // Handle Latitude, Longitude, and Altitude as number inputs
                  <input
                    type="number"
                    name={name}
                    value={formData[name] || ''}
                    className={`w-full p-2 border ${
                      errors[name] ? 'border-red-500' : 'border-gray-300'
                    } rounded`}
                    onChange={handleChange}
                    step="any" // Allow decimal values
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    className={`w-full p-2 border ${
                      errors[name] ? 'border-red-500' : 'border-gray-300'
                    } rounded`}
                    onChange={handleChange}
                  />
                )}

                {/* Display validation error */}
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

export default CreateStationForm;
