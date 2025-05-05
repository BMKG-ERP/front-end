import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const EquipmentFilterDropdown = ({
  selectedEquipment,
  setSelectedEquipment,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleEquipment = (value) => {
    setSelectedEquipment(value); // Set the selected equipment
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-teal-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-600"
      >
        Filter Equipment <FaChevronDown />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-3">
          <div className="flex flex-col gap-2 max-h-40 overflow-auto">
            {/* Equipment options */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={selectedEquipment === 'Seismometer'}
                onChange={() => toggleEquipment('Seismometer')}
              />
              Seismometer
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={selectedEquipment === 'Battery'}
                onChange={() => toggleEquipment('Battery')}
              />
              Battery
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentFilterDropdown;
