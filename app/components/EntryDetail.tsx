import React from "react";
import { Entry } from "../types/Entry";
import SparkleButton from "./SparkleButton";
import { useAIGeneration } from "../hooks/useAIGeneration";

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
  const {
    generateTitleFromContent,
    generateTagsFromContent,
    isTitleGenerating,
    isTagsGenerating,
    error,
    setError
  } = useAIGeneration();
  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-600">
        <p className="text-lg">Select an entry or click '+' to create a new one.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={currentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Title"
          className="text-2xl font-bold text-stone-800 bg-transparent border-b border-stone-300 pb-2 flex-1 focus:outline-none focus:border-blue-500"
          disabled={isLoading || isTitleGenerating}
        />
        <SparkleButton
          onClick={async () => {
            if (currentContent.trim() === '') {
              setError('Please add some content before generating a title');
              return;
            }
            const generatedTitle = await generateTitleFromContent(currentContent);
            if (generatedTitle) {
              onTitleChange(generatedTitle);
            }
          }}
          isLoading={isTitleGenerating}
          title="Generate title from content"
          size="md"
          className="ml-2"
        />
      </div>
      <textarea
        value={currentContent}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Start writing..."
        className="flex-1 text-lg text-stone-800 bg-transparent resize-none focus:outline-none mb-4"
        disabled={isLoading}
      />
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="tags" className="block text-sm font-medium text-stone-600">Tags (comma separated)</label>
          <SparkleButton
            onClick={async () => {
              if (currentContent.trim() === '') {
                setError('Please add some content before generating tags');
                return;
              }
              const generatedTags = await generateTagsFromContent(currentContent);
              if (generatedTags) {
                onTagsChange(generatedTags);
              }
            }}
            isLoading={isTagsGenerating}
            title="Generate tags from content"
            size="sm"
          />
        </div>
        <input
          id="tags"
          type="text"
          value={currentTags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="e.g. Work, Personal, Ideas"
          className="w-full p-2 text-sm text-stone-800 border border-stone-300 rounded focus:outline-none focus:border-blue-500"
          disabled={isLoading || isTagsGenerating}
        />
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
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
