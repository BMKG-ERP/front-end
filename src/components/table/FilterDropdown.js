import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const FilterDropdown = ({
  pendingCategoryFilters,
  setPendingCategoryFilters,
  setCategoryFilters,
  setPagination,
  categories,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  //   const categories = ['Stasiun Gempa Bumi', 'DUMMY CATEGORY'];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (value) => {
    setPendingCategoryFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    setCategoryFilters(pendingCategoryFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setOpen(false);
  };

  const handleReset = () => {
    setPendingCategoryFilters([]);
    setCategoryFilters([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-teal-800 text-white  px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-600"
      >
        Filter Categories <FaChevronDown />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-3">
          <div className="flex flex-col gap-2 max-h-40 overflow-auto">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={cat}
                  checked={pendingCategoryFilters.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
          <div className="mt-3 flex justify-between">
            <button
              onClick={handleApply}
              className="bg-teal-800 text-white px-3 py-1 rounded text-sm hover:bg-teal-600"
            >
              Filter
            </button>
          </div>
        </div>
      )}

      {/* Show selected categories below */}
      {pendingCategoryFilters.length > 0 && (
        <div className="flex flex-row">
          <div className="mt-2 text-sm text-gray-600 mr-2">
            Filter by: {pendingCategoryFilters.join(', ')}
          </div>{' '}
          <button
            onClick={handleReset}
            className="border-gray-200 border-2 text-gray-400 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-300"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
