import React from "react";
import { Entry } from "../types/Entry";

interface EntryDetailProps {
  entry: Entry | undefined;
  currentTitle: string;
  currentContent: string;
  currentTags: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

const EntryDetail: React.FC<EntryDetailProps> = ({
  entry,
  currentTitle,
  currentContent,
  currentTags,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onSave,
  onDelete,
  isLoading,
  hasUnsavedChanges,
}) => {
  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-600">
        <p className="text-lg">Select an entry or click '+' to create a new one.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        value={currentTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Title"
        className="text-2xl font-bold text-stone-800 bg-transparent border-b border-stone-300 pb-2 mb-4 focus:outline-none focus:border-blue-500"
        disabled={isLoading}
      />
      <textarea
        value={currentContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 text-lg text-stone-800 bg-transparent resize-none focus:outline-none mb-4"
        disabled={isLoading}
      />
      <div className="mb-4">
        <label htmlFor="tags" className="block text-sm font-medium text-stone-600 mb-1">Tags (comma separated)</label>
        <input
          id="tags"
          type="text"
          value={currentTags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="e.g. Work, Personal, Ideas"
          className="w-full p-2 text-sm text-stone-800 border border-stone-300 rounded focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-between items-center p-4 border-t border-stone-300 bg-stone-100">
        <span className="text-sm text-stone-500">{entry.strict_date}</span>
        <div className="flex space-x-2">
          {hasUnsavedChanges && (
            <button
              onClick={onSave}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          )}
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryDetail;
