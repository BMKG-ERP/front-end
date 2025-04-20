import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const SelectDropdown = ({
  url,
  data,
  setData,
  optionKey,
  valueKey,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch(url);
        const result = await response.json();
        if (!result.error && Array.isArray(result.data)) {
          setOptions(result.data);
        } else {
          console.warn('Invalid data format:', result);
        }
      } catch (error) {
        console.error('Failed to fetch options:', error);
      }
    }
    fetchOptions();
  }, [url]);

  const handleSelect = (item) => {
    const value = item[valueKey || optionKey];
    setData([value]); // single select
    setSearch('');
    setOpen(false);
  };

  const handleRemove = () => {
    setData([]);
  };

  const filteredOptions = options.filter((option) =>
    option[optionKey]?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSelected = data.length > 0;

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      {/* Select Box */}
      <div
        className={`w-full border rounded-lg ${
          isSelected ? 'cursor-default' : 'cursor-pointer'
        }`}
        onClick={() => {
          if (!isSelected) setOpen((prev) => !prev);
        }}
      >
        {!isSelected ? (
          <div className="p-2 w-full border text-black rounded-lg flex items-center justify-between ">
            <span className="text-gray-400">{placeholder}</span>
            <FaChevronDown />
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 bg-gray-100 w-full h-full">
            <span className=" px-2 py-0.5 rounded-full text-sm flex items-center gap-1">
              {data[0]}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="ml-2 text-red-500 hover:text-red-700 text-sm flex items-center"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {open && !isSelected && (
        <div className="absolute z-10 mt-2 w-full p-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ">
          <input
            type="text"
            placeholder="Search..."
            className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-40 overflow-auto flex flex-col gap-2">
            {filteredOptions.map((option, idx) => {
              const displayText = option[optionKey];
              return (
                <div
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm"
                >
                  {displayText}
                </div>
              );
            })}
            {filteredOptions.length === 0 && (
              <div className="text-sm text-gray-400">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
