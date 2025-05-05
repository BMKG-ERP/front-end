import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FilterDropdown = ({
  allOptions,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleOption = (value) => {
    if (value === 'ALL') {
      setSelectedOptions(
        selectedOptions.length === allOptions.length ? [] : allOptions
      );
    } else {
      setSelectedOptions((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
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
        Filter Channels <FaChevronDown />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-3">
          <div className="flex flex-col gap-2 max-h-40 overflow-auto">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedOptions.length === allOptions.length}
                onChange={() => toggleOption('ALL')}
              />
              Select All
            </label>
            {allOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(opt)}
                  onChange={() => toggleOption(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
