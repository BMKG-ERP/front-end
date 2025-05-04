'use client';

import EquipmentTable from './EquipmentTable';
import { useState, useEffect } from 'react';

import NotificationModal from './NotificationModal';
import CreateEquipmentForm from './CreateEquipmentForm';
import UpdateEquipmentForm from './UpdateEquipmentForm';
import DeleteEquipmentForm from './DeleteEquipmentForm';
import DetailEquipmentView from './DetailEquipmentForm';

// import EquipmenTable from './';

function EquipmentPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateEquipment, setIsCreateEquipment] = useState(false);
  const [isEditEquipment, setIsEditEquipment] = useState(false);
  const [isViewEquipment, setIsViewEquipment] = useState(false);
  const [isDeleteEquipment, setIsDeleteEquipment] = useState(false);

  const [formData, setFormData] = useState({
    calibration_date: null,
    category: null,
    description: null,
    equipment_id: null,
    firmware_version: null,
    input: null,
    installation_date: null,
    manufacture: null,
    name: null,
    sampling_rate: null,
    serial_number: null,
    station_code: null,
    status: null,
    supplier: null,
    technician: null,
    type: null,
  });

  const [isFormValid, setIsFormValid] = useState(true); // assume true by default
  const [notification, setNotification] = useState({
    code: '',
    title: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = (data = formData) => {
    let newErrors = {};

    // Required text fields
    [
      'name',
      'category',
      'equipment_id',
      'station_code',
      'status',
      'description',
    ].forEach((field) => {
      if (!data[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate optional fields with specific rules
    if (
      data.sampling_rate !== null &&
      (isNaN(data.sampling_rate) || data.sampling_rate <= 0)
    ) {
      newErrors.sampling_rate = 'Sampling rate must be a positive number';
    }

    // Validate calibration_date and installation_date format (if provided)
    ['calibration_date', 'installation_date'].forEach((dateField) => {
      if (data[dateField] && isNaN(Date.parse(data[dateField]))) {
        newErrors[dateField] = 'Invalid date format';
      }
    });

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const showNotification = (code, title, message) => {
    setNotification({ code, title, message });
  };

  const openCreateEquipment = () => setIsCreateEquipment(true);
  const closeCreateEquipment = () => {
    setIsCreateEquipment(false);
    setFormData({});
    setErrors({});
    setIsFormValid(true);
  };
  const openViewEquipment = (data) => {
    setFormData(data); // Populate form fields
    setIsViewEquipment(true);
  };
  const closeViewEquipment = () => {
    setFormData([]);
    setIsViewEquipment(false);
  };
  const openEditEquipment = (data) => {
    setFormData(data); // Populate form fields
    setIsEditEquipment(true);
  };

  const closeEditEquipment = () => {
    setFormData([]);
    setIsEditEquipment(false);
  };
  const openDeleteEquipment = (data) => {
    setFormData(data);
    setIsDeleteEquipment(true);
  };
  const closeDeleteEquipment = () => setIsDeleteEquipment(false);
  const closeNotificationPopup = () => setNotification({ message: '' });
  const closeNotificationAndModal = () => {
    setIsCreateEquipment(false);
    setIsEditEquipment(false);
    setIsDeleteEquipment(false);
    setFormData([]);
    setNotification({ message: '' });

    // Refresh the table
    // fetchData();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });

    // Re-validate the form on every change
    setTimeout(() => validateForm(), 0); // delay to ensure latest value is used
  };

  return (
    <div className="z-10 h-full w-full flex justify-center">
      <div className="w-full h-full max-w-[1800px] mt-10 border-x-2 border-gray-300 bg-white flex flex-col items-center py-4 px-4 md:px-8 lg:px-12">
        <h1 className="text-2xl font-bold">This is Equipment Page</h1>

        <div className="w-full h-full mx-auto mb-10 mt-5">
          <div className="flex flex-col items-center mb-5 justify-center z-20 w-full h-[300px] md:h-full">
            {/* <EquipmentTable /> */}
            <div className="w-full max-w-full p-4">
              {isLoading && (
                <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center">
                  <div className=" p-6 bg-white items-center flex flex-col justify-center rounded-lg shadow-lg w-[40vw] h-[40vh]  overflow-visible overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400">
                    LOADING
                  </div>
                </div>
              )}
              {notification.message && (
                <NotificationModal
                  closeNotificationAndModal={closeNotificationAndModal}
                  notification={notification}
                  closeNotificationPopup={closeNotificationPopup}
                />
              )}
              <div className="relative w-full">
                <EquipmentTable
                  openCreateEquipment={openCreateEquipment}
                  setIsLoading={setIsLoading}
                  openViewEquipment={openViewEquipment}
                  // openEditEquipment={openEditEquipment}
                  // openDeleteEquipment={openDeleteEquipment}
                />
              </div>
              {/* Modal */}
              {isCreateEquipment && (
                <CreateEquipmentForm
                  formData={formData}
                  setFormData={setFormData}
                  closeCreateEquipment={closeCreateEquipment}
                  showNotification={showNotification}
                  validateForm={validateForm}
                  handleChange={handleChange}
                  errors={errors}
                  setErrors={setErrors}
                  isFormValid={isFormValid}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}

              {isEditEquipment && (
                <UpdateEquipmentForm
                  formData={formData}
                  setFormData={setFormData}
                  closeEditEquipment={closeEditEquipment}
                  showNotification={showNotification}
                  validateForm={validateForm}
                  handleChange={handleChange}
                  errors={errors}
                  setErrors={setErrors}
                  isFormValid={isFormValid}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}
              {isViewEquipment && (
                <DetailEquipmentView
                  formData={formData}
                  setFormData={setFormData}
                  closeViewEquipment={closeViewEquipment}
                  showNotification={showNotification}
                  validateForm={validateForm}
                  handleChange={handleChange}
                  errors={errors}
                  setErrors={setErrors}
                  isFormValid={isFormValid}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}

              {isDeleteEquipment && (
                <DeleteEquipmentForm
                  formData={formData}
                  setFormData={setFormData}
                  closeDeleteEquipment={closeDeleteEquipment}
                  showNotification={showNotification}
                  validateForm={validateForm}
                  handleChange={handleChange}
                  errors={errors}
                  setErrors={setErrors}
                  isFormValid={isFormValid}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentPage;
