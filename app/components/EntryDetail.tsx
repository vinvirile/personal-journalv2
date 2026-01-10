import React from "react";
import { Entry } from "../types/Entry";
import SparkleButton from "./SparkleButton";
import { useAIGeneration } from "../hooks/useAIGeneration";
import { formatTimeCST, formatUpdatedAtCST } from "../../utils/dateUtils";

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
      <div className="flex flex-col items-center justify-center h-full opacity-20">
        <div className="w-24 h-24 bg-foreground/5 rounded-3xl flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p className="text-sm font-outfit tracking-widest uppercase">Select an entry to begin</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      <div className="flex-1 flex flex-col px-8 pt-8 pb-4 overflow-y-auto">
        <div className="flex items-start gap-4 mb-8 group">
          <textarea
            value={currentTitle}
            onChange={(e) => {
              onTitleChange(e.target.value);
              // Auto-resize title
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="A title for your thoughts..."
            rows={1}
            className="text-3xl md:text-4xl font-bold text-foreground bg-transparent border-none p-0 flex-1 focus:outline-none placeholder:text-foreground/10 font-outfit resize-none overflow-hidden"
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
            title="AI Title"
            size="md"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <textarea
          value={currentContent}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 text-xl text-foreground/80 bg-transparent resize-none focus:outline-none font-caveat leading-relaxed placeholder:text-foreground/5 min-h-[400px]"
          disabled={isLoading}
        />

        <div className="mt-12 py-8 border-t border-foreground/5 mb-20">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="tags" className="text-xs uppercase tracking-widest font-bold text-foreground/30 font-outfit">Tags</label>
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
              title="AI Tags"
              size="sm"
            />
          </div>
          <input
            id="tags"
            type="text"
            value={currentTags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="Personal, Reflection, Ideas..."
            className="w-full bg-foreground/5 border-none rounded-xl p-4 text-sm text-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-foreground/20 font-outfit"
            disabled={isLoading || isTagsGenerating}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 text-red-500 text-xs rounded-xl flex items-center justify-between animate-shake border border-red-500/20">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 glass rounded-full shadow-2xl border-glass-border animate-fade-in">
        <div className="flex flex-col items-center pr-4 border-r border-foreground/5">
          <span className="text-[10px] uppercase font-bold text-foreground/30 tracking-wider font-outfit">
            {entry.strict_date}
          </span>
          <span className="text-[10px] font-medium text-foreground/20 font-outfit">
             {entry.created_at && formatTimeCST(entry.created_at)}
          </span>
        </div>
        
        {entry.updated_at && entry.updated_at !== entry.created_at && (
          <span 
            className="text-[10px] font-medium text-foreground/30 font-outfit"
            suppressHydrationWarning
          >
            {formatUpdatedAtCST(entry.updated_at)}
          </span>
        )}
        
        {hasUnsavedChanges && (
          <button
            onClick={onSave}
            className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold font-outfit shadow-lg shadow-primary/20 transition-all-custom active:scale-95 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            Save
          </button>
        )}
        
        <button
          onClick={onDelete}
          className="p-2 text-foreground/30 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all-custom active:scale-90"
          title="Delete Entry"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EntryDetail;
