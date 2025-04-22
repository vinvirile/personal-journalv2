import React from "react"; // Removed useState
import { Entry } from "../types/Entry";
import DateRangePickerComponent from "./DateRangePicker";
import { formatTimeCST, formatUpdatedAtCST } from "../../utils/dateUtils";

interface EntryListProps {
  // entries: Entry[]; // Removed original entries prop
  filteredEntries: Entry[]; // Use filtered entries from hook
  selectedEntryId: number | null;
  onSelect: (id: number) => void;
  onAdd: () => void;
  onLock: () => void;
  isLoading: boolean;
  // Add props from hook
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  handleDateChange: (start: Date | null, end: Date | null) => void;
  startDate: Date | null;
  endDate: Date | null;
}

const EntryList: React.FC<EntryListProps> = ({
  // entries, // Removed
  filteredEntries, // Added
  selectedEntryId,
  onSelect,
  onAdd,
  onLock,
  isLoading,
  // Destructure new props from hook
  showDatePicker,
  setShowDatePicker,
  handleDateChange,
  startDate,
  endDate,
}) => {
  // Removed local useState for startDate, endDate, showDatePicker
  // Removed local handleDateChange
  // Removed local filteredEntries logic

  return (
    <div className="w-1/3 bg-stone-200 border-r border-stone-300 flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-stone-300">
        <div className="flex items-center">
        <h2 className="text-xl font-bold text-stone-800">Entries</h2>
        {/* Calendar Icon Button */}
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="ml-2 text-stone-600 hover:text-stone-800"
          title="Filter by Date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button
          onClick={onLock}
          className="ml-2 text-stone-600 hover:text-stone-800" // Added ml-2 for spacing
          title="Lock Journal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
      </div>
      <button
        onClick={onAdd}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
          {isLoading ? "..." : "+"}
        </button>
      </div>
      {/* Conditionally render the Date Range Picker, wrapped for centering */}
      {showDatePicker && (
        <div className="flex justify-center"> {/* Centering wrapper */}
          <DateRangePickerComponent onDateChange={handleDateChange} />
        </div>
      )}
      <div className="overflow-y-auto flex-1 p-4">
        {isLoading && filteredEntries.length === 0 && !startDate && !endDate ? ( // Adjust loading/empty states for filtering
          <p className="text-stone-600 text-center mt-8">Loading entries...</p>
        ) : filteredEntries.length === 0 ? (
          <p className="text-stone-600 text-center mt-8">
            {startDate && endDate ? "No entries found in this date range." : "No entries yet. Click '+' to add one."}
          </p>
        ) : (
          <ul>
            {filteredEntries.map((entry) => (
              <li
                key={entry.id}
              onClick={() => onSelect(entry.id)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedEntryId === entry.id
                  ? "bg-blue-100 border border-blue-300"
                  : "bg-white hover:bg-stone-50 border border-stone-300"
              }`}
            >
              <h3 className="text-lg font-semibold text-stone-800 truncate">{entry.title || "Untitled"}</h3>
              <p className="text-sm text-stone-600 truncate">{entry.content || "No content"}</p>
              <div className="flex flex-col text-xs text-stone-500 mt-1">
                <span>
                  {entry.strict_date} {entry.created_at && (
                    <span className="ml-1">{formatTimeCST(entry.created_at)}</span>
                  )}
                </span>
                {entry.updated_at && entry.updated_at !== entry.created_at && (
                  <span className="text-xs text-stone-400">
                    {formatUpdatedAtCST(entry.updated_at, "Edited")}
                  </span>
                )}
              </div>
              {entry.tags && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {entry.tags.split(",").map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EntryList;
