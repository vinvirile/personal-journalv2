import React from "react";
import { Entry } from "../types/Entry";
import DateRangePickerComponent from "./DateRangePicker";
import { formatTimeCST, formatUpdatedAtCST } from "../../utils/dateUtils";
import ThemeToggle from "./ThemeToggle";

interface EntryListProps {
  // entries: Entry[]; // Removed original entries prop
  filteredEntries: Entry[]; // Use filtered entries from hook
  selectedEntryId: string | null;
  onSelect: (id: string) => void;
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
    <div className="w-1/3 bg-sidebar-bg border-r border-foreground/5 flex flex-col h-full transition-all-custom">
      <div className="flex justify-between items-center px-6 py-6 border-b border-foreground/5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground font-outfit">Journal</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`p-1.5 rounded-lg transition-all-custom ${showDatePicker ? 'bg-primary/10 text-primary' : 'text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5'}`}
              title="Filter by Date"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              onClick={onLock}
              className="p-1.5 rounded-lg text-foreground/40 hover:text-foreground/60 hover:bg-foreground/5 transition-all-custom"
              title="Lock Journal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>
        </div>
        <button
          onClick={onAdd}
          disabled={isLoading}
          className="bg-primary hover:bg-primary-hover text-white flex items-center justify-center w-8 h-8 rounded-full shadow-lg shadow-primary/20 transition-all-custom disabled:opacity-50 active:scale-95"
          title="New Entry"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </button>
      </div>

      {showDatePicker && (
        <div className="px-4 py-4 bg-foreground/5 border-b border-foreground/5 animate-fade-in">
          <DateRangePickerComponent onDateChange={handleDateChange} />
        </div>
      )}

      <div className="overflow-y-auto flex-1 px-4 py-6 space-y-3">
        {isLoading && filteredEntries.length === 0 && !startDate && !endDate ? (
          <div className="flex flex-col items-center justify-center mt-20 opacity-40">
            <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-foreground text-sm font-outfit">Reflecting on entries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center mt-20 px-8">
            <div className="w-16 h-16 bg-foreground/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-foreground/40 text-sm font-outfit">
              {startDate && endDate ? "No matches for these dates." : "A quiet journal... start a new entry."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <div 
              key={entry.id}
              onClick={() => onSelect(entry.id)}
              className={`group p-4 rounded-3xl cursor-pointer transition-all-custom animate-slide-up border-2 ${
                selectedEntryId === entry.id
                  ? "bg-card-bg border-primary shadow-[0_8px_30px_rgb(0,0,0,0.08)] scale-[1.02]"
                  : "bg-transparent border-transparent hover:bg-card-bg/40 hover:border-foreground/5"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
                <h3 className={`text-base font-semibold font-outfit mb-1 truncate ${selectedEntryId === entry.id ? 'text-primary' : 'text-foreground/80'}`}>
                  {entry.title || "Untitled Entry"}
                </h3>
                <p className="text-sm text-foreground/50 line-clamp-2 font-light leading-relaxed mb-3">
                  {entry.content || "Silence is golden..."}
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 opacity-60">
                    <span className="text-[10px] uppercase tracking-wider font-bold font-outfit text-foreground/40">
                      {entry.strict_date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-foreground/20"></span>
                    <span className="text-[10px] font-medium font-outfit text-foreground/40">
                      {entry.created_at && formatTimeCST(entry.created_at)}
                    </span>
                  </div>
                  {entry.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.split(",").slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-[10px] font-medium bg-foreground/5 text-foreground/60 px-2 py-0.5 rounded-md">
                          {tag.trim()}
                        </span>
                      ))}
                      {entry.tags.split(",").length > 3 && (
                        <span className="text-[10px] text-foreground/30 font-medium px-1">
                          +{entry.tags.split(",").length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryList;
