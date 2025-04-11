'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const DeleteEquipmentForm = ({
  formData,
  setFormData,
  closeDeleteEquipment,
  showNotification,
  validateForm,
  handleChange,
  errors,
  setErrors,
  isFormValid,
  setIsLoading,
  isLoading,
}) => {
  const deleteEquipment = async () => {
    setIsLoading(true);
    try {
      const equipment_id = formData.equipment_id;

      if (!equipment_id) {
        console.error('Error: equipment id is missing or empty!');
        return; // Stop execution if station_code is invalid
      }

      const url = `http://127.0.0.1:8000/api/crud/stations/${equipment_id}/`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipment_id: equipment_id }), // Only if required
      });

      const result = await response.json();
      setIsLoading(false);
      if (!result.error && result.code === 200) {
        showNotification(
          result.code,
          `Success delete equipment with id ${formData.equipment_id}`,
          result.message
        );
      } else {
        showNotification(
          result.code,
          `Failed delete equipment with id ${formData.equipment_id}`,
          result.message
        );
      }
      closeEditStation(); // Close modal after deletion
    } catch (error) {
      setIsLoading(false);
      showNotification(500, `Server error`, 'Internal Server Error');
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
            onClick={closeDeleteEquipment}
          />
        </div>
        <div className="flex items-center p-4 justify-center">
          <h1>Are you sure want to delete this station?</h1>
        </div>
        <div className="flex items-center p-4 justify-center">
          <button
            className="px-4 py-3 rounded-2xl border-2 border-teal-700 mx-5 hover:bg-teal-300"
            onClick={closeDeleteEquipment}
          >
            Cancel
          </button>
          <button
            className="px-4 text-white py-3 mx-5 bg-red-600 rounded-2xl hover:bg-red-400"
            onClick={deleteEquipment}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEquipmentForm;
