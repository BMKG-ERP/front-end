'use client';

import { useState, useEffect } from 'react';
import CreateStationForm from './CreateStationForm';
import UpdateStationForm from './UpdateStationForm';
import DeleteStationForm from './DeleteStationForm';

import StationTable from './StationsTable';
import NotificationModal from './NotificationModal';

function StationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateStation, setIsCreateStation] = useState(false);
  const [isEditStation, setIsEditStation] = useState(false);
  const [isDeleteStation, setIsDeleteStation] = useState(false);
  const [formData, setFormData] = useState({
    station_code: '',
    category: '',
    unit: '',
    description: '',
    status: '',
    maps: '',
    latitude: '',
    longitude: '',
    altitude: '',
    province: '',
    city: '',
    district: '',
    subdistrict: '',
    network: '',
    start_date: '',
    address: '',
    use_flag: '',
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

    [
      'station_code',
      'category',
      'unit',
      'status',
      'province',
      'city',
      'address',
      'description',
    ].forEach((field) => {
      if (!data[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (
      data.latitude === '' ||
      isNaN(data.latitude) ||
      data.latitude < -90 ||
      data.latitude > 90
    ) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    if (
      data.longitude === '' ||
      isNaN(data.longitude) ||
      data.longitude < -180 ||
      data.longitude > 180
    ) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    if (!data.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const showNotification = (code, title, message) => {
    setNotification({ code, title, message });
  };

  const openCreateStation = () => setIsCreateStation(true);
  const closeCreateStation = () => {
    setIsCreateStation(false);
    setFormData({});
    setErrors({});
    setIsFormValid(true);
  };
  const openEditStation = (data) => {
    setFormData(data); // Populate form fields
    setIsEditStation(true);
  };

  const closeEditStation = () => {
    setFormData([]);
    setIsEditStation(false);
  };
  const openDeleteStation = (data) => {
    setFormData(data);
    setIsDeleteStation(true);
  };
  const closeDeleteStation = () => setIsDeleteStation(false);
  const closeNotificationPopup = () => setNotification({ message: '' });
  const closeNotificationAndModal = () => {
    setIsCreateStation(false);
    setIsEditStation(false);
    setIsDeleteStation(false);
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
        <h1 className="text-2xl font-bold">This is Station Page</h1>

        <div className="w-full h-full mx-auto mb-10 mt-5">
          <div className="flex flex-col items-center mb-5 justify-center z-20 w-full h-[300px] md:h-full">
            {/* <StationTable /> */}
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
                <StationTable
                  openCreateStation={openCreateStation}
                  setIsLoading={setIsLoading}
                  openEditStation={openEditStation}
                  openDeleteStation={openDeleteStation}
                />
              </div>
              {/* Modal */}
              {isCreateStation && (
                <CreateStationForm
                  formData={formData}
                  setFormData={setFormData}
                  closeCreateStation={closeCreateStation}
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

              {isEditStation && (
                <UpdateStationForm
                  formData={formData}
                  setFormData={setFormData}
                  closeEditStation={closeEditStation}
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

              {isDeleteStation && (
                <DeleteStationForm
                  formData={formData}
                  setFormData={setFormData}
                  closeDeleteStation={closeDeleteStation}
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

export default StationPage;
