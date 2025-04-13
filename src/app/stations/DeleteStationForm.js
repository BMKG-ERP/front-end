'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const DeleteStationForm = ({
  formData,
  setFormData,
  closeDeleteStation,
  showNotification,
  validateForm,
  handleChange,
  errors,
  setErrors,
  isFormValid,
  setIsLoading,
  isLoading,
}) => {
  const deleteStation = async () => {
    setIsLoading(true);
    try {
      const stationCode = formData.station_code;

      if (!stationCode) {
        console.error('Error: station_code is missing or empty!');
        return; // Stop execution if station_code is invalid
      }

      const url = `${process.env.NEXT_PUBLIC_LOCAL_API}/api/crud/stations/${stationCode}/`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station_code: stationCode }), // Only if required
      });

      if (!response.ok) {
        throw new Error(`Failed to delete station: ${response.statusText}`);
      }

      const result = await response.json();
      setIsLoading(false);
      showNotification(
        `Succes create new Station with code ${formData.station_code} `,
        result.message
      );
      closeEditStation(); // Close modal after deletion
    } catch (error) {
      setIsLoading(false);
      showNotification(
        `Failed Delete Station ${formData.station_code} `,
        result.message
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delete Station</h2>
          <FaTimes
            className="cursor-pointer hover:opacity-70"
            onClick={closeDeleteStation}
          />
        </div>
        <div className="flex items-center p-4 justify-center">
          <h1>Are you sure want to delete this station?</h1>
        </div>
        <div className="flex items-center p-4 justify-center">
          <button
            className="px-4 py-3 rounded-2xl border-2 border-teal-700 mx-5 hover:bg-teal-300"
            onClick={closeDeleteStation}
          >
            Cancel
          </button>
          <button
            className="px-4 text-white py-3 mx-5 bg-red-600 rounded-2xl hover:bg-red-400"
            onClick={deleteStation}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStationForm;
