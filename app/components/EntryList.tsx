import React from "react";
import { Entry } from "../types/Entry";

interface EntryListProps {
  entries: Entry[];
  selectedEntryId: number | null;
  onSelect: (id: number) => void;
  onAdd: () => void;
  onLock: () => void;
  isLoading: boolean;
}

const EntryList: React.FC<EntryListProps> = ({
  entries,
  selectedEntryId,
  onSelect,
  onAdd,
  onLock,
  isLoading,
}) => (
  <div className="w-1/3 bg-stone-200 border-r border-stone-300 flex flex-col h-full">
    <div className="flex justify-between items-center p-4 border-b border-stone-300">
      <div className="flex items-center">
        <h2 className="text-xl font-bold text-stone-800">Entries</h2>
        <button
          onClick={onLock}
          className="ml-2 text-stone-600 hover:text-stone-800"
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
    <div className="overflow-y-auto flex-1 p-4">
      {isLoading && entries.length === 0 ? (
        <p className="text-stone-600 text-center mt-8">Loading entries...</p>
      ) : entries.length === 0 ? (
        <p className="text-stone-600 text-center mt-8">No entries yet. Click &#39;+&#39; to add one.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
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
              <p className="text-xs text-stone-500 mt-1">{entry.strict_date}</p>
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

export default EntryList;
